const opts = require('./src/decoratorOptions').decoratorOptions;

const reactSsrDecoratorConfig = require('./src/react/ssr-decorator-config');
const reactRuntimeDecoratorConfig = require('./src/react/client-decorator-config');

const reactDomSsrDecoratorConfig = require('./src/react-dom/ssr-decorator-config');
const reactDomRuntimeDecoratorConfig = require('./src/react-dom/client-decorator-config');

const reactDomProfilingRuntimeDecoratorConfig = require('./src/react-dom/profiling/client-decorator-config');

exports.onCreateWebpackConfig = (gatsbyConfig, configOptions) => {
  const {
    react = { options: opts.runtime | opts.ssr },
    reactDOM = { options: opts.runtime | opts.ssr | opts.enableProfiler },
  } = configOptions;

  // Enable react component decoration
  if (react) {
    if (react.options & opts.ssr) {
      reactSsrDecoratorConfig.applyConfig({...gatsbyConfig});
    }
    if (react.options & opts.runtime) {
      reactRuntimeDecoratorConfig.applyConfig({...gatsbyConfig});
    }
  }

  // Enable react-dom component decoration
  if (reactDOM) {
    const isProfilerEnabled = (reactDOM.options & opts.enableProfiler) && process.env.NODE_ENV === 'production';
    const ssrConfig = reactDomSsrDecoratorConfig;
    const runtimeConfig = isProfilerEnabled ? reactDomProfilingRuntimeDecoratorConfig : reactDomRuntimeDecoratorConfig;

    if (reactDOM.options & opts.ssr) {
      ssrConfig.applyConfig({...gatsbyConfig});
    }
    if (reactDOM.options & opts.runtime) {
      runtimeConfig.applyConfig({...gatsbyConfig});
    }
  }
}