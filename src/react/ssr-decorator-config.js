exports.applyConfig = ({ getConfig, actions, stage }) => {
  try {
    if (stage !== "build-html" && stage !== "develop-html") {
      return;
    }

    const config = getConfig();
    
    // Gatsby v3:
    // externalFunc has signature: 
    // ({
    //   context,
    //   getResolve,
    //   request
    // }, callback)

    // See: https://github.com/gatsbyjs/gatsby/blob/04d1d37d53e28deb13ec46dd97fb79b2c6cc863e/packages/gatsby/src/utils/webpack.config.js#L746

    let reactOriginal = 'react';
    if (config.resolve?.alias?.react) {
        reactOriginal = config.resolve.alias.react;
        delete config.resolve.alias.react
    }

    if (config.externals) {
      let _, externalFunc, rest = undefined;
      if (stage === 'develop-html') {
        externalFunc = config.externals[0];
      } else if (stage === 'build-html') {
        [_, externalFunc, ...rest] = config.externals;
      }

      if (typeof externalFunc === 'function') {
        const newExternalFunc =
          function (obj, callback) {
            const { context, request, getResolve } = obj;

            const isAliasRequest = 
              request === 'react' || request === './react' || 
              request === 'react-dom' || request === './react-dom';
            const isReactRequest = request.startsWith(`___react-`); //=== `___react-original___` || `___react-dom-original___`;
            
            if (isReactRequest) {
              const resolver = getResolve({
                dependencyType: `commonjs`
              }); // User modules that do not need to be part of the bundle

              resolver(context, request, (err, newRequest) => {
                if (err) {
                  callback(err);
                  return;
                }
                callback(null, newRequest);
              });
              return;
            } else if (isAliasRequest) {
              callback();
              return;
            }

            externalFunc(obj, callback);
          };

        if (stage === 'develop-html') {
          config.externals = newExternalFunc;
        } else if (stage === 'build-html') {
          config.externals = [_, newExternalFunc, ...rest];
        }
      }
    }

    // This will completely replace the webpack config with the modified object.
    actions.replaceWebpackConfig(config);

    actions.setWebpackConfig({
      resolve: {
        alias: {
          "react$": require.resolve(`webpack-decorators-react`),
          "___react-original___$": require.resolve(reactOriginal),
        },
      }
    });
  } catch (ex) {
    console.error(
      `[ssr-decorator-config] Unable to enable SSR react component decoration: ${ex}`,
      ex
    );
  }
}