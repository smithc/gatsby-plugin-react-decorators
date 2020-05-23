const opts = require('./src/decoratorOptions').decoratorOptions;

const reactSsrDecoratorConfig = require('./src/react/ssr-decorator-config');
const reactRuntimeDecoratorConfig = require('./src/react/client-decorator-config');

const reactDomSsrDecoratorConfig = require('./src/react-dom/ssr-decorator-config');
const reactDomRuntimeDecoratorConfig = require('./src/react-dom/client-decorator-config');

exports.onCreateWebpackConfig = (gatsbyConfig, configOptions) => {
  const {
    react = { options: opts.runtime | opts.ssr },
    reactDOM = { options: opts.runtime | opts.ssr },
  } = configOptions;

  // Enable react component decoration
  if (react) {
    if (react.options & opts.ssr) {
      reactSsrDecoratorConfig.applyConfig({...gatsbyConfig});
    }
    if (react & opts.runtime) {
      reactRuntimeDecoratorConfig.applyConfig({...gatsbyConfig});
    }
  }

  // Enable react-dom component decoration
  if (reactDOM) {
    if (reactDOM.options & opts.ssr) {
      reactDomSsrDecoratorConfig.applyConfig({...gatsbyConfig});
    }
    if (reactDOM.options & opts.runtime) {
      reactDomRuntimeDecoratorConfig.applyConfig({...gatsbyConfig});
    }
  }
}