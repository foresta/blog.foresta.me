const path = require('path');

module.exports = {
  entry: {
    'javascripts/entry': './src/entry.js',
    'javascripts/preload': './src/preload.js',
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        parser: {amd: false},
        include: /node_modules\/lodash\//, // https://github.com/lodash/lodash/issues/3052
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          }
        ]
      },
      {
        test: /\.scss$/, 
        use: [
          'style-loader', 
          {
            loader: 'css-loader', 
            options: {
              url: false,
              sourceMap: true,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      },
      {
        test: /\.css$/, 
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true
            }
          }
        ]
      },
      {test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: 'url-loader?limit=100000'},
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  performance: {hints: false},
};
