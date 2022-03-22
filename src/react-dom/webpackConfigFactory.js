exports.getWebpackConfig = function (useProfiler, aliases) {
    const reactDomPath = useProfiler ? `gatsby-plugin-react-decorators/src/react-dom/profiling/react-dom-profiler` : `webpack-decorators-react-dom`;
    const schedulerPath = useProfiler ? `scheduler/tracing-profiling` : 'scheduler/tracing';

    aliases = {
      'scheduler/tracing': schedulerPath,
      ...aliases
    };
    const resolveAlias = (module, defaultPath) => aliases[module] ?? defaultPath ?? module;

    return {
      resolve: {
        alias: {
          "react-dom$": require.resolve(reactDomPath),
          "scheduler/tracing": require.resolve(resolveAlias(`scheduler/tracing`)),
          "___react-dom-original___$": require.resolve(resolveAlias(`react-dom`)),
        },
      }
    };
};