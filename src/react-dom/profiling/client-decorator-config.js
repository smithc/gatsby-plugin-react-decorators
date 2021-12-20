const { getWebpackConfig } = require("../webpackConfigFactory");

exports.applyConfig = ({ getConfig, actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  if (stage === "build-javascript") {
    // Customize the webpack config's optimization.splitChunks
    const webpackConfig = getConfig();
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
    actions.replaceWebpackConfig(webpackConfig);
  }

  actions.setWebpackConfig(getWebpackConfig(true));
}
