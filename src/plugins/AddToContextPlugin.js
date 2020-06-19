'use strict';

// Note: this plugin is only necessary due Gatsby pinning Webpack to ~4.xx.x
// This plugin will emit a deprecation warning during Webpack compilation
//  however we can safely ignore this, as this plugin is only necessary on
//  Webpack versions < 5 (where enhanced aliasing is natively supported)
// from: https://stackoverflow.com/a/33290812

class AddToContextPlugin {
  constructor(extras) {
    this.extras = extras || [];
  }

  apply(compiler) {
    compiler.plugin('context-module-factory', (cmf) => {
      cmf.plugin('after-resolve', (result, callback) => {
        this.newContext = true;
        return callback(null, result);
      });

      // this method is called for every path in the ctx
      // we just add our extras the first call
      cmf.plugin('alternatives', (result, callback) => {
        if (this.newContext) {
          this.newContext = false;

          const extras = this.extras.map((ext) => {
            return {
              context: result[0].context,
              request: ext
            };
          });

          result.push.apply(result, extras);
        }
        return callback(null, result);
      });
    });
  }
}

module.exports = AddToContextPlugin;