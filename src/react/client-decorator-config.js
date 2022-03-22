exports.applyConfig = ({ getConfig, actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  const config = getConfig();
  if (config.resolve?.alias) {
    delete config.resolve.alias.react
  }
  actions.replaceWebpackConfig(config);

  actions.setWebpackConfig({
    resolve: {
      alias: {
        react: require.resolve(`webpack-decorators-react`),
        "___react-original___$": require.resolve(`react`),
      },
    }
  });
}
