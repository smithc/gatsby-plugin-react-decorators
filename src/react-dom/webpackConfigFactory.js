exports.getWebpackConfig = function (useProfiler) {
    const reactDomPath = useProfiler ? `gatsby-plugin-react-decorators/src/react-dom/profiling/react-dom-profiler` : `webpack-decorators-react-dom`;
    const schedulerPath = useProfiler ? `scheduler/tracing-profiling` : 'scheduler/tracing';

    return {
        resolve: {
          alias: {
            "react-dom$": require.resolve(reactDomPath),
            "scheduler/tracing": require.resolve(schedulerPath),
            "___react-dom-original___$": require.resolve(`react-dom`),
          },
        }
      };
};