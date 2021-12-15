# Setup

1. Install the package

`npm install gatsby-plugin-react-decorators`

2. Configure the plugin in your local `gastby-config.js` file

```
// gatsby-config.js

const opts = require('gatsby-plugin-react-decorators').decoratorOptions;

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-react-decorators",
      options: {
        react: {
            options: opts.runtime | opts.ssr
        },
        reactDOM: {
            options: opts.runtime | opts.ssr | opts.enableProfiler
        }
      },
    }]
}
```

Note that the `opts.enableProfiler` option (enabled by default) will enable the React profiler (as if you had added the `--profile` option to `gatsby build`/`gatsby develop`, or manually specified `react-dom/profiling` as a webpack alias for `react-dom`).

3. Register your local decorators

If you're using decorators during the server-side render process, add the following to your `gatsby-ssr.js` file:

```
// gatsby-ssr.js

import { registerDecorator } from 'webpack-decorators';

// This code can be executed immediately
const exampleDecorator = {
    createElement: function(originalFunc, ...args) {
        // Put your custom logic here...
        return originalFunc(...args);
    }
};

registerDecorator('react', exampleDecorator, 'createElement');

```

If you're using decorators during runtime (in the browser), add the following to your `gatsby-browser.js` file:

```
// gatsby-browser.js
import { registerDecorator } from 'webpack-decorators';

export const onClientEntry = () => {

    const exampleDecorator = {
        createElement: function(originalFunc, ...args) {
            // Put your custom logic here...
            return originalFunc(...args);
        }
    };

    registerDecorator('react', exampleDecorator, 'createElement');
};
```

> __*Note*:__
> 
>  You can register multiple decorators with multiple `registerDecorator` statements.