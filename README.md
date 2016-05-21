# url loader for webpack with optional emit

The same as url-loader but can be configured so that no files are emitted even when the file size is larger than the limit (Url is still resolved).

A typical use case is compiling both server-side and client-side source codes in isomorphic application e.g. React server side rendering. When compiling both, resources have to be processed and loaded consistently without duplicated file emission. For example, a React component contains `require("./img.png")`. Under both server-side and client-side code compilations, the require statements should be resolved to the same path. One can achieve this by using the same set of loaders but "img.png" will be emitted twice. This loader aims at solving this issue.

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Client webpack config (with file emission)

``` javascript
const config = {
  entry: {
    app: ...
  },
  ...
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /node_modules/,
        loader: 'optional-emit-url?name=img/[name].[ext]!img'
      },
      ...
    ]
  }
}
```

server webpack config (without file emission)

``` javascript
const config = {
  entry: {
    app: ...
  },
  ...
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /node_modules/,
        loader: 'optional-emit-url?name=img/[name].[ext]&emit=false!img'
      },
      ...
    ]
  }
}
```

This loader supports all parameters used by url-loader and file-loader. For example,

``` javascript
require("url?limit=10000&emit=false!./file.png");
// => DataUrl if "file.png" is smaller that 10kb. Resolve path without emitting files when "file.png" is larger that 10kb.
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
