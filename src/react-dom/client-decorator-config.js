const { getWebpackConfig } = require("./webpackConfigFactory");

exports.applyConfig = ({ actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  actions.setWebpackConfig(getWebpackConfig());
}
