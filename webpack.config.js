const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: {
    "javascripts/entry": "./src/entry.js", 
    "javascripts/preload": "./src/preload.js",
  },
  output: {
    path: "./static",
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]   
        }
      },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".json", ".jsx"]
  },
  plugins: [
    new WebpackPwaManifest({
        name: "foresta's blog",
        icons: [],
        short_name: "foresta",
        description: "foresta's developer blog",
        background_color: '#61c0ca'
    })
  ]
};
