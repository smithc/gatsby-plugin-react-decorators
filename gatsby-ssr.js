const React = require('react');
const opts = require('./src/decoratorOptions').decoratorOptions;

// The whole purpose of this plugin is to remove static references to the `react-dom/profiling` module
// and to instead dynamically import the `react-dom/profiling` module based on the presence of the `useProfiler` query string param.
exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents, getPostBodyComponents, replacePostBodyComponents }, configOptions) => {
  const { 
    reactDOM  = { options: opts.runtime | opts.ssr | opts.enableProfiler }, 
  } = configOptions;

  const isProfilerEnabled = reactDOM && (reactDOM.options & opts.enableProfiler) && process.env.NODE_ENV === 'production';
  if (!isProfilerEnabled)
    return;
  
  const headComponents = getHeadComponents();

  const matchesProfilerLink = component => component.type === 'link' && /react-dom-profiling-.*\.js$/.test(component.key);
  const matchesProfilerScript = component => component.type === 'script' && /react-dom-profiling-.*\.js$/.test(component.key);
  const reactProfilerLinkIndex = headComponents.findIndex(matchesProfilerLink);

  // If the profiler is enabled, we need to inject the script tag synchronously.
  // We can ensure that the browser downloads, parses and executes the script synchronously by using the 
  // `document.write` API (as opposed to the DOM Node APIs, which execute asynchronously).
  const inlineHeadScriptValue = href => `
    (function() {
      try {
        if (window.location.search.indexOf("useProfiler") !== -1) {
          var script = document.createElement("script");
          script.src = "${href}";
          script.async = false;
          document.write(script.outerHTML);
        }
      }catch {}
    })();
  `;
  const mangledInlineHeadScript = href => inlineHeadScriptValue(href).replace(/\n/g, '');

  if (reactProfilerLinkIndex !== -1) {
    // Create new inline script to replace the profiler link
    // <script type='text/javascript' dangerouslySetInnerHTML={{ __html: mangledInlineScript(headComponents[reactProfilerLinkIndex].props.href) }} />;
    const inlineHeadScript = React.createElement('script', { type: 'text/javascript', dangerouslySetInnerHTML: { __html: mangledInlineHeadScript(headComponents[reactProfilerLinkIndex].props.href) } });
    headComponents[reactProfilerLinkIndex] = inlineHeadScript;

    // And now ensure that we don't have any other references to the script in question
    const updatedHeadComponents = headComponents.filter(component => !matchesProfilerLink(component));
    replaceHeadComponents(updatedHeadComponents);
  } else {
    console.log("WARNING!!! react-dom-profiling.js was not found in the headComponents array");
  }

  // Now remove the same references that may be duplicated in the postBodyComponents, but check for 'script' tags instead of link tags
  const postBodyComponents = getPostBodyComponents();
  const reactProfilerScriptIndex = postBodyComponents.findIndex(matchesProfilerScript);

  if (reactProfilerScriptIndex !== -1) {
    const updatedPostBodyComponents = postBodyComponents
      .filter(component => !matchesProfilerScript(component));
      
    replacePostBodyComponents(updatedPostBodyComponents);
  } else {
    console.log('WARNING!!! react-dom-profiling.js was not found in the postBodyComponents array');
  }
}