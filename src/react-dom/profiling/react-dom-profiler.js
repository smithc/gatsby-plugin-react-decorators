const { createProxy } = require('webpack-decorators');
const ReactDOMResolver = () => require('___react-dom-original___');

// Dynamically Load the `react-dom/profiling` module when in SSR mode (and not client-side)
// This is required (especially with the `webpackPreload: true` comment) to indicate 
// to webpack that the `react-dom/profiling` module should be marked as a dynamic dependency during build
if (typeof window === 'undefined') {
    import(/* webpackPreload: true */ 'react-dom/profiling');
}

const ReactDOMProfilerResolver = () => {
    // The following module resolution occurs client-side only. We'll dynamically load the `react-dom-profiling` module
    // in the browser only, when the `useProfiler` query param flag is present.
    // The `resolveWeak` call ensures that webpack doesn't try to resolve the `react-dom/profiling` module 
    // as either a static OR dynamic dependency. Instead, it assumes that the module has already been loaded via other means.
    const moduleId =  require.resolveWeak('react-dom/profiling');
    const webpackRequire = eval(`__webpack_require__`);
    return webpackRequire(moduleId);
};

// Conditionally enable profiling if requested via query param
const useProfiler = typeof window !== 'undefined'
    && window.location && window.location.search.indexOf('useProfiler') !== -1;

const proxiedModule = useProfiler ? ReactDOMProfilerResolver() : ReactDOMResolver();
const reactDOMProxy = createProxy(proxiedModule, 'react-dom');

module.exports = reactDOMProxy;

Object.getOwnPropertyNames(reactDOMProxy).forEach(prop => {
    module.exports[prop] = reactDOMProxy[prop];
});

module.exports.default = reactDOMProxy;