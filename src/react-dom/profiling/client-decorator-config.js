const { getWebpackConfig } = require("../webpackConfigFactory");

exports.applyConfig = ({ getConfig, actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  if (stage === "build-javascript") {
    // Customize the webpack config's optimization.splitChunks
    const webpackConfig = getConfig();
    const cacheGroups = webpackConfig.optimization.splitChunks.cacheGroups;

    const profilers = {
      test: /node_modules[/\\]react-dom[\\/](profiling|((cjs|umd)[\\/]react-dom\.(profiling|development)))/,
      name: 'react-dom-profiling',
      enforce: true,
      priority: 100,
    };

    cacheGroups.profilers = profilers;
    actions.replaceWebpackConfig(webpackConfig);
  }

  actions.setWebpackConfig(getWebpackConfig(true));
}
