const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: {
    entry: "./src/entry.js", 
    preload: "./src/preload.js"
  },
  output: {
    path: "./static/javascripts",
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
