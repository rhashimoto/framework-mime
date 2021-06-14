import {
  sessionStarted,
  sessionFinished,
  sessionFailed,
} from '@web/test-runner-core/browser/session.js';

const STANDALONE_PATH = new URL('./jasmine-standalone/lib/jasmine-3.7.1', import.meta.url).href;

(async () => {
  sessionStarted();

  // Load Jasmine standalone assets by adding HTML elements to the document.
  const html = new DOMParser().parseFromString(`
    <link rel="shortcut icon" type="image/png" href="${STANDALONE_PATH}/jasmine_favicon.png">
    <link rel="stylesheet" type="text/css" href="${STANDALONE_PATH}/jasmine.css" crossorigin="anonymous">
    
    <script type="text/javascript" src="${STANDALONE_PATH}/jasmine.js"></script>
    <script type="text/javascript" src="${STANDALONE_PATH}/jasmine-html.js"></script>
  `, 'text/html');

  const scriptLoad = [];
  for (const element of html.querySelectorAll('link, script')) {
    if (element.tagName.match(/^script$/i)) {
      // Script elements created by DOMParser are not executable so
      // add a copy to the document.
      const script = document.createElement('script');
      script.type = element.type;
      script.src = element.src;
      script.async = false;
      scriptLoad.push(new Promise(resolve => script.onload = resolve));
      document.head.appendChild(script);
    } else {
      document.head.appendChild(element);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  await Promise.all(scriptLoad);

  // Just fail.
  sessionFailed(new Error('intentional abort'));
})();
