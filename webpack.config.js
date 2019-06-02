const path = require('path')

module.exports = {
  entry: {
    "javascripts/entry": "./src/entry.js", 
    "javascripts/preload": "./src/preload.js",
  },
  output: {
    path: path.resolve(__dirname, "static"),
    filename: "[name].bundle.js"
  },
  module: {
      rules: [
          {
              parser: { amd: false },
              include: /node_modules\/lodash\// // https://github.com/lodash/lodash/issues/3052
          },
          {
              test: /\.js$/,
              loader: "babel-loader",
              options: {
                  presets: ["es2015"]   
              }
          },
          { test: /\.css$/, loader: "style!css" },
          { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] },
          { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: 'url-loader?limit=100000' }
      ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"]
  }
};
