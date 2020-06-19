const opts = require('./src/decoratorOptions').decoratorOptions;

const reactSsrDecoratorConfig = require('./src/react/ssr-decorator-config');
const reactRuntimeDecoratorConfig = require('./src/react/client-decorator-config');

const reactDomSsrDecoratorConfig = require('./src/react-dom/ssr-decorator-config');
const reactDomRuntimeDecoratorConfig = require('./src/react-dom/client-decorator-config');

const AddToContextPlugin = require('./src/plugins/AddToContextPlugin');

exports.onCreateWebpackConfig = (gatsbyConfig, configOptions) => {
  const { actions } = gatsbyConfig;
  const {
    react = { options: opts.runtime | opts.ssr, boundaryTargets: [] },
    reactDOM = { options: opts.runtime | opts.ssr },
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
    if (reactDOM.options & opts.ssr) {
      reactDomSsrDecoratorConfig.applyConfig({...gatsbyConfig});
    }
    if (reactDOM.options & opts.runtime) {
      reactDomRuntimeDecoratorConfig.applyConfig({...gatsbyConfig});
    }
  }

  const aliases = {};
  const boundaryTargets = react.boundaryTargets;
  for (target of boundaryTargets) {
    const [component, path] = [ ...target ];
    aliases[`__webpack-decorators__Components__${path}__${component}`] = path;
  }

  actions.setWebpackConfig({
    resolve: {
      alias: aliases,
    },
    plugins: [
      // See note in AddToContextPlugin.js for why this is necessary
      new AddToContextPlugin(Object.getOwnPropertyNames(aliases))
    ]
  })
}