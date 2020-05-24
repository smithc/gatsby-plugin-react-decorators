exports.applyConfig = ({ actions, stage }) => {
  if (stage !== "build-javascript" && stage !== "develop") {
    return;
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        "react-dom$": require.resolve(`webpack-decorators-react-dom`),
        "___react-dom-original___$": require.resolve(`react-dom`)
      },
    }
  });
}
