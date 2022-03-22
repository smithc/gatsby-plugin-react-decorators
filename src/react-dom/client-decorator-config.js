const { getWebpackConfig } = require("./webpackConfigFactory");

exports.applyConfig = ({ getConfig, actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  const config = getConfig();
  let reactDomOriginal = "react-dom";
  if (config.resolve?.alias && config.resolve.alias[`react-dom`]) {
    reactDomOriginal = config.resolve.alias[`react-dom`];
    delete config.resolve.alias[`react-dom`];
  }
  actions.replaceWebpackConfig(config);

  actions.setWebpackConfig(getWebpackConfig(false, {
    'react-dom': reactDomOriginal
  }));
}
