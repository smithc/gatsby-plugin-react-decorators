const { getWebpackConfig } = require("../webpackConfigFactory");

exports.applyConfig = ({ getConfig, actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  const webpackConfig = getConfig();
  
  let reactDomOriginal = "react-dom";
  if (webpackConfig.resolve?.alias && webpackConfig.resolve.alias[`react-dom`]) {
    reactDomOriginal = webpackConfig.resolve.alias[`react-dom`];
    delete webpackConfig.resolve.alias[`react-dom`];
  }

  if (stage === "build-javascript") {
    // Customize the webpack config's optimization.splitChunks
    const cacheGroups = webpackConfig.optimization.splitChunks.cacheGroups;

    const profilerMatches = [
      /node_modules[/\\]react-dom[\\/](profiling|((cjs|umd)[\\/]react-dom\.(profiling|development)))/,
      /node_modules[/\\]scheduler[\\/](tracing-profiling|(cjs|umd)[\\/](scheduler(\.|-)tracing))/
    ];
    const regexes = new RegExp(profilerMatches
      .map(r => `(${r.source})`)
      .join('|'));

    const profilers = {
      test: regexes,
      name: 'react-dom-profiling',
      enforce: true,
      priority: 100,
    };

    cacheGroups.profilers = profilers;
  }

  actions.replaceWebpackConfig(webpackConfig);

  actions.setWebpackConfig(getWebpackConfig(true, {
    'react-dom': reactDomOriginal
  }));
}