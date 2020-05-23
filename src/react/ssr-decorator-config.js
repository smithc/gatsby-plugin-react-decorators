exports.applyConfig = ({ getConfig, actions, stage }) => {
  try {
    if (stage !== "build-html" && stage !== "develop-html") {
      return;
    }

    const config = getConfig();
    const [externalFunc, ...rest] = config.externals;

    config.externals = [
      function (context, request, callback) {
        externalFunc(context, request, (_, resolvedImport) => {
          if (request === "___react-original___") {
            // This ensures that our original react alias is resolved 'externally' (used by ReactWrapper)
            callback(null, `umd react`);
            return;
          }

          if (resolvedImport === "umd react") {
            // This overrides the resolution of an external 'react' reference to resolve to our
            // aliased decorator 'ReactWrapper'
            callback();
          } else if (resolvedImport !== undefined) {
            // This ensures that any normal external overrides are adhered to with no modification
            callback(null, resolvedImport);
          } else {
            // if resolvedImport is undefined, then we should just call the callback
            callback();
          }
        });
      },
    ...rest];

    // This will completely replace the webpack config with the modified object.
    actions.replaceWebpackConfig(config);

    actions.setWebpackConfig({
      resolve: {
        alias: {
          react$: require.resolve(`webpack-decorators-react`),
          "___react-original___$": require.resolve(`react`),
        },
      },
    });
  } catch (ex) {
    console.error(
      `[ssr-decorator-config] Unable to enable SSR react component decoration: ${ex}`,
      ex
    );
  }
}