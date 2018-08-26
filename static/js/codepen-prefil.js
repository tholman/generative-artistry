function launchPrefil() {
  var form = document.querySelector('form');
  var data = {
    title: document.querySelector('h1').innerText,
    description: '\"' + document.querySelector('h1').innerText + '\" is a generative art piece, built through an interactive tutorial on [Generative Artistry](https://generativeartistry.com).',
    html: '<div class="border">\n  <div class="frame">\n    <canvas></canvas>\n  </div>\n</div>\n\n<div class="callback">\n  Like this? Check out the tutorial on <a href="https://generativeartistry.com" target="_blank">Generative Artistry\n</div>',
    css: 'body {\n  background: #fff;\n  display: flex;\n  height: 100vh;\n  margin: 0;\n  align-items: center;\n  justify-content: center;\n  --blur: 2px;\n}\n\n.border {\n  box-sizing: border-box;\n  position: relative;\n  background: black;\n  background-image: -webkit-gradient(linear, right top, left bottom, from(#111), to(#000));\n  padding: 20px;\n  box-shadow: -1px 1px var(--blur) 1px rgba(0, 0, 0, 0.1), -2px 2px var(--blur) 1px rgba(0, 0, 0, 0.09), -3px 3px var(--blur) 1px rgba(0, 0, 0, 0.08), -4px 4px var(--blur) 1px rgba(0, 0, 0, 0.07), -5px 5px var(--blur) 1px rgba(0, 0, 0, 0.06), -6px 6px var(--blur) 1px rgba(0, 0, 0, 0.05), -7px 7px var(--blur) 1px rgba(0, 0, 0, 0.04), -8px 8px var(--blur) 1px rgba(0, 0, 0, 0.03), -9px 9px var(--blur) 1px rgba(0, 0, 0, 0.03), -10px 10px var(--blur) 1px rgba(0, 0, 0, 0.03), -11px 11px var(--blur) 1px rgba(0, 0, 0, 0.03), -12px 12px var(--blur) 1px rgba(0, 0, 0, 0.02), -13px 13px var(--blur) 1px rgba(0, 0, 0, 0.02), -14px 14px var(--blur) 1px rgba(0, 0, 0, 0.01), -15px 15px var(--blur) 1px rgba(0, 0, 0, 0.01), -16px 16px var(--blur) 1px rgba(0, 0, 0, 0.01);\n}\n\n.frame {\n  left: 3%;\n  top: 2.5%;\n  box-shadow: inset -1px 1px 6px 1px rgba(0, 0, 0, 0.24);\n  background: white;\n  align-items: center;\n  display: flex;\n  padding: 40px;\n  box-sizing: border-box;\n}\n\ncanvas {\n  box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.2);\n  height: 320px;\n  width: 320px;\n  background-size: cover;\n  background-position: center center;\n}\n\n.callback {\n  position: absolute;\n  font-family: monospace;\n  bottom: 20px;\n}',
    tags: ['generative', 'generative art', document.querySelector('h1').innerText, 'code art', 'tutorial'],
    editors: "0010",
    layout: "left"
  };

  if(window.editor) {
    data.js = window.editor.getValue();
    data.js = data.js.split('window.innerWidth').join('320');
  }

  document.querySelector(("input[name=data]")).value = JSON.stringify(data);
  form.submit();
}

document.querySelector('#codepen-prefil').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo(0,document.body.scrollHeight);
  setTimeout(function() {
    launchPrefil();
  }, 0);
});
