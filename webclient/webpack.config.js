const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require("@babel/polyfill");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: false,
  },
    node: {
        fs: 'empty',
        child_process: 'empty',
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    entry: {
      main: ['@babel/polyfill', './src/index.js'],
      worker: ['@babel/polyfill', './src/worker/generate.js'],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: "./src/index.html",
          minify: false
        }),

        // Copy our app's index.html to the build folder.
        new CopyWebpackPlugin([
//            { from: './src/index.html', to: "index.html" },
//            { from: './js', to: "./js" },
//            { from: './css', to: "./css" },
            { from: './public', to: "./public" },
            { from: './CNAME', to: "./" },  // to prevent github resetting our domain 
          ])
    ]
};
