/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as strings from '../../../base/common/strings.js';
import { Range } from '../../common/core/range.js';
import { EditOperation } from '../../common/core/editOperation.js';
var EditOperationsCommand = /** @class */ (function () {
    function EditOperationsCommand(edits, initialSelection) {
        this._initialSelection = initialSelection;
        this._edits = edits;
    }
    EditOperationsCommand._handleEolEdits = function (editor, edits) {
        var newEol = undefined;
        var singleEdits = [];
        for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
            var edit = edits_1[_i];
            if (typeof edit.eol === 'number') {
                newEol = edit.eol;
            }
            if (edit.range && typeof edit.text === 'string') {
                singleEdits.push(edit);
            }
        }
        if (typeof newEol === 'number') {
            editor.getModel().setEOL(newEol);
        }
        return singleEdits;
    };
    EditOperationsCommand.executeAsCommand = function (editor, _edits) {
        var edits = this._handleEolEdits(editor, _edits);
        var cmd = new EditOperationsCommand(edits, editor.getSelection());
        editor.pushUndoStop();
        editor.executeCommand('formatEditsCommand', cmd);
        editor.pushUndoStop();
    };
    EditOperationsCommand.isFullModelReplaceEdit = function (editor, edit) {
        var model = editor.getModel();
        var editRange = model.validateRange(edit.range);
        var fullModelRange = model.getFullModelRange();
        return fullModelRange.equalsRange(editRange);
    };
    EditOperationsCommand.execute = function (editor, _edits) {
        var edits = this._handleEolEdits(editor, _edits);
        editor.pushUndoStop();
        if (edits.length === 1 && EditOperationsCommand.isFullModelReplaceEdit(editor, edits[0])) {
            // We use replace semantics and hope that markers stay put...
            editor.executeEdits('formatEditsCommand', edits.map(function (edit) { return EditOperation.replace(Range.lift(edit.range), edit.text); }));
        }
        else {
            editor.executeEdits('formatEditsCommand', edits.map(function (edit) { return EditOperation.replaceMove(Range.lift(edit.range), edit.text); }));
        }
        editor.pushUndoStop();
    };
    EditOperationsCommand.prototype.getEditOperations = function (model, builder) {
        for (var _i = 0, _a = this._edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            // We know that this edit.range comes from the mirror model, so it should only contain \n and no \r's
            var trimEdit = EditOperationsCommand.trimEdit(edit, model);
            if (trimEdit !== null) {
                builder.addEditOperation(Range.lift(edit.range), edit.text);
            }
        }
        var selectionIsSet = false;
        if (Array.isArray(this._edits) && this._edits.length === 1 && this._initialSelection.isEmpty()) {
            if (this._edits[0].range.startColumn === this._initialSelection.endColumn &&
                this._edits[0].range.startLineNumber === this._initialSelection.endLineNumber) {
                selectionIsSet = true;
                this._selectionId = builder.trackSelection(this._initialSelection, true);
            }
            else if (this._edits[0].range.endColumn === this._initialSelection.startColumn &&
                this._edits[0].range.endLineNumber === this._initialSelection.startLineNumber) {
                selectionIsSet = true;
                this._selectionId = builder.trackSelection(this._initialSelection, false);
            }
        }
        if (!selectionIsSet) {
            this._selectionId = builder.trackSelection(this._initialSelection);
        }
    };
    EditOperationsCommand.prototype.computeCursorState = function (model, helper) {
        return helper.getTrackedSelection(this._selectionId);
    };
    EditOperationsCommand.fixLineTerminators = function (edit, model) {
        edit.text = edit.text.replace(/\r\n|\r|\n/g, model.getEOL());
    };
    /**
     * This is used to minimize the edits by removing changes that appear on the edges of the range which are identical
     * to the current text.
     *
     * The reason this was introduced is to allow better selection tracking of the current cursor and solve
     * bug #15108. There the cursor was jumping since the tracked selection was in the middle of the range edit
     * and was lost.
     */
    EditOperationsCommand.trimEdit = function (edit, model) {
        this.fixLineTerminators(edit, model);
        return this._trimEdit(model.validateRange(edit.range), edit.text, edit.forceMoveMarkers, model);
    };
    EditOperationsCommand._trimEdit = function (editRange, editText, editForceMoveMarkers, model) {
        var currentText = model.getValueInRange(editRange);
        // Find the equal characters in the front
        var commonPrefixLength = strings.commonPrefixLength(editText, currentText);
        // If the two strings are identical, return no edit (no-op)
        if (commonPrefixLength === currentText.length && commonPrefixLength === editText.length) {
            return null;
        }
        if (commonPrefixLength > 0) {
            // Apply front trimming
            var newStartPosition = model.modifyPosition(editRange.getStartPosition(), commonPrefixLength);
            editRange = new Range(newStartPosition.lineNumber, newStartPosition.column, editRange.endLineNumber, editRange.endColumn);
            editText = editText.substring(commonPrefixLength);
            currentText = currentText.substr(commonPrefixLength);
        }
        // Find the equal characters in the rear
        var commonSuffixLength = strings.commonSuffixLength(editText, currentText);
        if (commonSuffixLength > 0) {
            // Apply rear trimming
            var newEndPosition = model.modifyPosition(editRange.getEndPosition(), -commonSuffixLength);
            editRange = new Range(editRange.startLineNumber, editRange.startColumn, newEndPosition.lineNumber, newEndPosition.column);
            editText = editText.substring(0, editText.length - commonSuffixLength);
            currentText = currentText.substring(0, currentText.length - commonSuffixLength);
        }
        return {
            text: editText,
            range: editRange,
            forceMoveMarkers: editForceMoveMarkers
        };
    };
    return EditOperationsCommand;
}());
export { EditOperationsCommand };
