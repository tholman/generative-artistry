(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.TutorialMarkdown = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var CodeBlock = function () {
    function CodeBlock(element, codeSelector, tabSize) {
      classCallCheck(this, CodeBlock);

      this.element = element;
      this.from = parseInt(element.getAttribute('data-from'));
      this.to = element.getAttribute('data-to');
      this.indent = parseInt(element.getAttribute('data-indent')) || 0;

      var code = null;
      if (codeSelector) {
        code = element.querySelector(codeSelector).innerText;
      } else {
        code = element.innerText;
      }

      this.code = this.prepareCode(code, tabSize);

      this.lines = this.code.split('\n').length;

      // Set "TO" value to from + lines it isn't set
      this.to = this.to ? parseInt(this.to) : this.from + this.lines;
    }

    createClass(CodeBlock, [{
      key: 'prepareCode',
      value: function prepareCode(code, tabSize) {
        var _this = this;

        var parsedCode = code.split('\n');

        // Add indentation
        parsedCode = parsedCode.map(function (string) {
          if (string !== '') {
            return ' '.repeat(tabSize * _this.indent) + string;
          } else {
            return string;
          }
        });

        return parsedCode.join('\n');
      }
    }, {
      key: 'shouldBeActive',
      value: function shouldBeActive() {
        var rect = this.element.getBoundingClientRect();

        // 1/3 of rect is at 1/2 of window
        return rect.y + rect.height / 3 < window.innerHeight / 2;
      }
    }]);
    return CodeBlock;
  }();

  var CodeManager = function () {
    function CodeManager(options) {
      classCallCheck(this, CodeManager);

      this.codeBlocks = [];
      var _options$selectors = options.selectors,
          blockSelector = _options$selectors.blockSelector,
          codeSelector = _options$selectors.codeSelector;


      this.blockSelector = options.blockSelector;

      var blockElements = document.querySelectorAll(blockSelector);
      for (var i = 0; i < blockElements.length; i++) {
        this.codeBlocks.push(new CodeBlock(blockElements[i], codeSelector, options.tabSize));
      }
    }

    createClass(CodeManager, [{
      key: 'getStep',
      value: function getStep() {
        for (var i = this.codeBlocks.length - 1; i >= 0; i--) {
          if (this.codeBlocks[i].shouldBeActive()) {
            return i;
          }
        }
        return -1;
      }
    }, {
      key: 'getBlockByStep',
      value: function getBlockByStep(step) {
        return this.codeBlocks[step];
      }
    }]);
    return CodeManager;
  }();

  var EditorManager = function () {
    function EditorManager(options) {
      var _this = this;

      classCallCheck(this, EditorManager);

      this.hasTyped = false;
      this.lastExecuted = null;

      var editor = options.editor;

      this.editor = editor.editor;
      this.api = editor.api;

      this.editor.onKeyDown(function () {
        _this.hasTyped = true;
      });
    }

    createClass(EditorManager, [{
      key: 'executeBlock',
      value: function executeBlock(block) {

        if (this.hasTyped) {
          this.hasTyped = false;
          this.replaceWith(this.lastExecuted);
        }

        // If we are trying to append beyond the current line count, add the lines
        var lineCount = this.editor.getModel().getLineCount();
        if (lineCount < block.from) {
          var linesNeeded = block.from - lineCount;
          var _range = new this.api.Range(block.from, 1, block.from + linesNeeded, 1);
          var newLines = '\n'.repeat(linesNeeded);
          var _operation = {
            identifier: { major: 1, minor: 1 },
            range: _range,
            text: newLines,
            forceMoveMarkers: true
          };

          this.editor.executeEdits(newLines, [_operation]);
        }

        var range = new this.api.Range(block.from, 1, block.to, 1);
        var operation = {
          identifier: { major: 1, minor: 1 },
          range: range,
          text: block.code,
          forceMoveMarkers: true
        };

        this.editor.executeEdits(block.code, [operation]);
        this.editor.revealLines(block.from, block.from + block.lines);

        // Save last state (to undo any manually typed code)
        this.lastExecuted = this.getCode();
      }
    }, {
      key: 'replaceWith',
      value: function replaceWith(code) {
        var range = new this.api.Range(0, 1, 9999, 1);
        var operation = {
          identifier: { major: 1, minor: 1 },
          range: range,
          text: code,
          forceMoveMarkers: true
        };
        this.editor.executeEdits(code, [operation]);
      }
    }, {
      key: 'getCode',
      value: function getCode() {
        return this.editor.getValue();
      }
    }]);
    return EditorManager;
  }();

  var IframeManager = function () {
    function IframeManager(options) {
      classCallCheck(this, IframeManager);

      this.iframe = options.iframe;
    }

    createClass(IframeManager, [{
      key: 'sendCode',
      value: function sendCode(code) {
        this.iframe.contentWindow.postMessage(code, '*');
      }
    }]);
    return IframeManager;
  }();

  var TutorialMarkdown = function () {
    function TutorialMarkdown(options) {
      classCallCheck(this, TutorialMarkdown);
      var editor = options.editor;

      this.scheduled = false;
      this.currentStep = -1;

      this.editorManager = new EditorManager({ editor: editor });
      this.iframeManager = new IframeManager({ iframe: options.iframe });

      this.codeManager = new CodeManager({
        selectors: options.markdownSelector,
        tabSize: editor.editor.getModel()._options.tabSize
      });

      // Saving the post executed state, so when we step backwards we can
      // reapply previous set information
      this.savedSteps = [this.editorManager.getCode()];

      this.throttleScroll = this.throttleScroll.bind(this);
      this.sendCode = this.sendCode.bind(this);
      this.create();
    }

    createClass(TutorialMarkdown, [{
      key: 'throttleScroll',
      value: function throttleScroll() {
        var _this = this;

        if (!this.scheduled) {
          this.scheduled = true;
          window.requestAnimationFrame(function () {
            _this.scheduled = false;
            _this.onScroll();
          });
        }
      }
    }, {
      key: 'onScroll',
      value: function onScroll() {
        var step = this.codeManager.getStep();
        if (step > this.currentStep) {

          for (var i = this.currentStep + 1; i <= step; i++) {
            this.stepForward(i);
          }
        } else if (step < this.currentStep) {
          this.stepBackward(step);
        }

        this.currentStep = step;
      }
    }, {
      key: 'stepForward',
      value: function stepForward(step) {
        var block = this.codeManager.getBlockByStep(step);
        this.editorManager.executeBlock(block);

        var currentCode = this.editorManager.getCode();

        if (!this.savedSteps[step + 1]) {
          this.savedSteps.push(currentCode);
        }

        this.iframeManager.sendCode(currentCode);

        return step;
      }
    }, {
      key: 'stepBackward',
      value: function stepBackward(step) {
        this.editorManager.replaceWith(this.savedSteps[step + 1]);
        var currentCode = this.editorManager.getCode();
        this.iframeManager.sendCode(currentCode);
      }
    }, {
      key: 'create',
      value: function create() {
        window.addEventListener('scroll', this.throttleScroll);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        window.removeEventListener('scroll', this.throttleScroll);
      }
    }, {
      key: 'sendCode',
      value: function sendCode() {
        var currentCode = this.editorManager.getCode();
        this.iframeManager.sendCode(currentCode);
      }
    }]);
    return TutorialMarkdown;
  }();

  return TutorialMarkdown;

})));