exports.getWebpackConfig = function (useProfiler, aliases) {
    const reactDomPath = useProfiler ? `gatsby-plugin-react-decorators/src/react-dom/profiling/react-dom-profiler` : `webpack-decorators-react-dom`;
    const resolveAlias = (module, defaultPath) => aliases[module] ?? defaultPath ?? module;

    return {
      resolve: {
        alias: {
          "react-dom$": require.resolve(reactDomPath),
          "___react-dom-original___$": require.resolve(resolveAlias(`react-dom`)),
        },
      }
    };
};