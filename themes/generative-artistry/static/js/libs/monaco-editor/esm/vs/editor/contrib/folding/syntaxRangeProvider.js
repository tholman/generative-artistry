/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { toPromiseLike } from '../../../base/common/async.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { MAX_LINE_NUMBER, FoldingRegions } from './foldingRanges.js';
var MAX_FOLDING_REGIONS_FOR_INDENT_LIMIT = 5000;
var foldingContext = {
    maxRanges: MAX_FOLDING_REGIONS_FOR_INDENT_LIMIT
};
var SyntaxRangeProvider = /** @class */ (function () {
    function SyntaxRangeProvider(providers) {
        this.providers = providers;
    }
    SyntaxRangeProvider.prototype.compute = function (model, cancellationToken) {
        return collectSyntaxRanges(this.providers, model, cancellationToken).then(function (ranges) {
            if (ranges) {
                var res = sanitizeRanges(ranges);
                return res;
            }
            return null;
        });
    };
    return SyntaxRangeProvider;
}());
export { SyntaxRangeProvider };
function collectSyntaxRanges(providers, model, cancellationToken) {
    var promises = providers.map(function (provider) { return toPromiseLike(provider.provideFoldingRanges(model, foldingContext, cancellationToken)); });
    return TPromise.join(promises).then(function (lists) {
        var rangeData = null;
        if (cancellationToken.isCancellationRequested) {
            return null;
        }
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            if (list && Array.isArray(list.ranges)) {
                if (!Array.isArray(rangeData)) {
                    rangeData = [];
                }
                var nLines = model.getLineCount();
                for (var _i = 0, _a = list.ranges; _i < _a.length; _i++) {
                    var r = _a[_i];
                    if (r.startLineNumber > 0 && r.endLineNumber > r.startLineNumber && r.endLineNumber <= nLines) {
                        rangeData.push({ startLineNumber: r.startLineNumber, endLineNumber: r.endLineNumber, rank: i, type: r.type });
                    }
                }
            }
        }
        return rangeData;
    }, onUnexpectedExternalError);
}
var RangesCollector = /** @class */ (function () {
    function RangesCollector(foldingRangesLimit) {
        this._startIndexes = [];
        this._endIndexes = [];
        this._nestingLevels = [];
        this._nestingLevelCounts = [];
        this._types = [];
        this._length = 0;
        this._foldingRangesLimit = foldingRangesLimit;
    }
    RangesCollector.prototype.add = function (startLineNumber, endLineNumber, type, nestingLevel) {
        if (startLineNumber > MAX_LINE_NUMBER || endLineNumber > MAX_LINE_NUMBER) {
            return;
        }
        var index = this._length;
        this._startIndexes[index] = startLineNumber;
        this._endIndexes[index] = endLineNumber;
        this._nestingLevels[index] = nestingLevel;
        this._types[index] = type;
        this._length++;
        if (nestingLevel < 30) {
            this._nestingLevelCounts[nestingLevel] = (this._nestingLevelCounts[nestingLevel] || 0) + 1;
        }
    };
    RangesCollector.prototype.toIndentRanges = function () {
        if (this._length <= this._foldingRangesLimit) {
            var startIndexes = new Uint32Array(this._length);
            var endIndexes = new Uint32Array(this._length);
            for (var i = 0; i < this._length; i++) {
                startIndexes[i] = this._startIndexes[i];
                endIndexes[i] = this._endIndexes[i];
            }
            return new FoldingRegions(startIndexes, endIndexes, this._types);
        }
        else {
            var entries = 0;
            var maxLevel = this._nestingLevelCounts.length;
            for (var i = 0; i < this._nestingLevelCounts.length; i++) {
                var n = this._nestingLevelCounts[i];
                if (n) {
                    if (n + entries > this._foldingRangesLimit) {
                        maxLevel = i;
                        break;
                    }
                    entries += n;
                }
            }
            var startIndexes = new Uint32Array(entries);
            var endIndexes = new Uint32Array(entries);
            var types = [];
            for (var i = 0, k = 0; i < this._length; i++) {
                var level = this._nestingLevels[i];
                if (level < maxLevel) {
                    startIndexes[k] = this._startIndexes[i];
                    endIndexes[k] = this._endIndexes[i];
                    types[k] = this._types[i];
                    k++;
                }
            }
            return new FoldingRegions(startIndexes, endIndexes, types);
        }
    };
    return RangesCollector;
}());
export { RangesCollector };
export function sanitizeRanges(rangeData) {
    var sorted = rangeData.sort(function (d1, d2) {
        var diff = d1.startLineNumber - d2.startLineNumber;
        if (diff === 0) {
            diff = d1.rank - d2.rank;
        }
        return diff;
    });
    var collector = new RangesCollector(MAX_FOLDING_REGIONS_FOR_INDENT_LIMIT);
    var top = null;
    var previous = [];
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var entry = sorted_1[_i];
        if (!top) {
            top = entry;
            collector.add(entry.startLineNumber, entry.endLineNumber, entry.type, previous.length);
        }
        else {
            if (entry.startLineNumber > top.startLineNumber) {
                if (entry.endLineNumber <= top.endLineNumber) {
                    previous.push(top);
                    top = entry;
                    collector.add(entry.startLineNumber, entry.endLineNumber, entry.type, previous.length);
                }
                else if (entry.startLineNumber > top.endLineNumber) {
                    do {
                        top = previous.pop();
                    } while (top && entry.startLineNumber > top.endLineNumber);
                    previous.push(top);
                    top = entry;
                    collector.add(entry.startLineNumber, entry.endLineNumber, entry.type, previous.length);
                }
            }
        }
    }
    return collector.toIndentRanges();
}
