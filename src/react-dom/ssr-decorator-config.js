const { getWebpackConfig } = require("./webpackConfigFactory");

exports.applyConfig = ({ actions, stage }) => {
  if (stage !== "build-html" && stage !== "develop-html") {
    return;
  }

  actions.setWebpackConfig(getWebpackConfig());
}