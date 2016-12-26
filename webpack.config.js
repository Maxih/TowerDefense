var path = require("path");
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./lib/tower_defense.js",
  output: {
    path: path.join(__dirname, 'scripts'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js"]
  },

};
