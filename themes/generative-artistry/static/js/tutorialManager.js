// (function() {

  // Editor variables
  var frame = document.querySelector('iframe');
  var editor;

  // Code variables
  var contentElement = document.querySelector('.content');
  var triggers, blocks, structure, sendItButton, fullCodeSets;
  var currentStep = -1;
  var hasTyped = false;

  function setup() {
    setupCode();
  }

  function setupCode() {
    require.config({ paths: { 'vs': '/js/libs/monaco-editor/vs' }});
    require(['vs/editor/editor.main'], function() {
      editor = monaco.editor.create(document.getElementById('tutorial-code'), {
        value: [
          '// Welcome to Tutorial Markdown.',
          '// start scrolling, and we\'ll',
          '// write the code.'
        ].join('\n'),
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        language: 'javascript',
        fontSize: 10,
        minimap: {
          enabled: false
        },
        hover: false,
        occurrencesHighlight: false
      });

      editor.onKeyDown(function(e) {
        hasTyped = true;
      })

      editor.getModel().updateOptions({ tabSize: 2 })

      setupTutorial();
    });

    bind();
  }

  function setupTutorial() {

    sendItButton = document.querySelector('.tutorial-send-code');
    sendItButton.addEventListener('click', sendCode);

    structure = [];
    fullCodeSets = {};

    saveCode(currentStep)

    window.addEventListener('scroll', onContentScroll);
    triggers = document.querySelectorAll('.tmd-trigger');
    blocks = document.querySelectorAll('.tmd');
    for( var i = 0; i < blocks.length; i++ ) {
      var blockElement = blocks[i];
      
      var blockStructure = {
        code: blockElement.innerHTML.replace('&gt;', '>').replace('&lt;', '<').replace('&lt;', '<'),
        action: blockElement.getAttribute('data-action'),
        from: parseInt(blockElement.getAttribute('data-from')),
        to: blockElement.getAttribute('data-to'),
        lines: blockElement.innerHTML.split('\n').length
      }

      if( blockStructure.to === 'all' ) {
        blockStructure.to = parseInt(blockStructure.from) + blockStructure.code.split('\n').length
      } else {
        blockStructure.to = parseInt(blockStructure.to);
      }

      structure.push(blockStructure)
    }

  }

  function onContentScroll(e) {

    var hitSteps = -1;

    for( var i = 0; i < triggers.length; i++) {
      var dimensions = triggers[i].getBoundingClientRect();
      var headerHeight = 65; // todo, not put here.

      if( dimensions.y + dimensions.height/3 < ((window.innerHeight - headerHeight) / 2 + headerHeight)) {
        
        if( i === currentStep + 1 ) {
          currentStep = i;
          onCodeAdd(i);
        }

        hitSteps = i;
      }
    }

    if( hitSteps === currentStep - 1) {
      currentStep = currentStep - 1;
      onCodeRemove(currentStep + 1);
      sendCode(currentStep);
    }
  }

  function onCodeRemove(step) {
    var range = new monaco.Range(0, 1, 999, 1);
    var id = { major: 1, minor: 1 };           
    var op = {identifier: id, range: range, text: fullCodeSets[step - 1], forceMoveMarkers: true};
    editor.executeEdits(fullCodeSets[step - 1], [op]);
    hasTyped = false;
  }

  function onCodeAdd(step) {

    if( hasTyped === true ) {
      onCodeRemove(step);
    }

    // Positioning the instructions
    var instructions = structure[step];

    var range = new monaco.Range(instructions.from, 1, instructions.to, 1);
    var id = { major: 1, minor: 1 };           
    var op = {identifier: id, range: range, text: instructions.code, forceMoveMarkers: true};
    editor.executeEdits(instructions.code, [op]);

    editor.revealLines(instructions.from, instructions.from + instructions.lines);
    sendCode();
    saveCode(step);
  }

  function onCodeReverse(step) {
    console.log("remove!");
  }

  function sendCode() {
    var value = editor.getValue()
    
    frame.contentWindow.postMessage(value, "*")
  }

  function saveCode(step) {

    // Only save these ones per each step.
    if( !fullCodeSets[step] ) {
      fullCodeSets[step] = editor.getValue();
    }

  }

  function bind() {}

  setup();

// })();