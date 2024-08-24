# mv3-hot-reload

Enable hot reloading for content script and background script (service worker) in MV3.

## Install

```
yarn add mv3-hot-reload
```

## How to use

### 1. Inject the code for hot reloading

#### Leverage Webpack's "multi-main entry" (Recommended)

```ts
// webpack.config.ts
const isDev = process.env.NODE_ENV === 'development'

/**
 * @param entryType specify the entry type for different entry names than 'content' or 'background'
 */
function getEntry(name: string, entryType?: 'content' | 'background') {
  return [path.join(srcDir, name), ...(isDev ? [`mv3-hot-reload/${entryType ?? name}`] : [])]
}

const webpackConfig = {
  // ...
  entry: {
    // ...
    background: getEntry('background'),
    content: getEntry('content'),
    anotherContentScript: getEntry('anotherContentScriptFolder', 'content'),
  },
}
```

**PLEASE NOTE:** if you intend to use this on different environments, you should also change the condition to `isDev` to the match the proper environment

#### Import files into your background script (service worker) and content script

The code for hot reloading will only execute when `process.env.NODE_ENV === 'development'`.

```ts
// background.ts
import 'mv3-hot-reload/background'

// your code...
```

```ts
// content.ts
import 'mv3-hot-reload/content'

// your code...
```

### 2. Add a script to your `package.json` and run it before development

Example:

```diff
    "watch:src": "webpack --config webpack/webpack.dev.js --watch",
+   "watch:dist": "mv3-hot-reload",
+   "dev": "concurrently yarn:watch:*",
```

## mv3-hot-reload.config.js (Optional)

```js
module.exports = {
  // Specify the port of hot reload server, defaults to 9012
  port: 9012,
  // Specify other valid ENVs that you wish to use other than `development`
  envs: ['sandbox']
  // Specify the directory you want to watch, defaults to 'dist'
  directory: 'dist',
  // Specifies an array of filenames that should be excluded in watched directory
  exclude: [],

}
```

If you want to set the port or other allowed dev environments, you also need to expose it with `process.env.MV3_HOT_RELOAD_PORT` to
the client side.

An example:

```js
// webpack.config.js

const config = require('./mv3-hot-reload.config')

module.exports = {
  // ...
  plugins: [
    new webpack.EnvironmentPlugin({
      MV3_HOT_RELOAD_PORT: config.port,
      MV3_HOT_RELOAD_DEV_ENVS: config.envs,
    }),
  ],
}
```

## Example

[pacexy/chrome-extension-typescript-starter](https://github.com/pacexy/chrome-extension-typescript-starter)

## Credits

The implementation of hot reloading in mv3 refers to [theprimone/violet](https://github.com/theprimone/violet).

## License

MIT
