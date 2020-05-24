exports.applyConfig = ({ actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        react$: require.resolve(`webpack-decorators-react`),
        "___react-original___$": require.resolve(`react`),
      },
    }
  });
}
