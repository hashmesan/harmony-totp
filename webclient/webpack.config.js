const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require("@babel/polyfill");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {GitRevisionPlugin} = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
var webpack = require("webpack")

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
          {
            test: /\.css?$/,
            use: ['css-loader'],
          },          
        ],
      },
    entry: {
      main: ['@babel/polyfill', './src/index.js'],
      worker: ['@babel/polyfill', './src/worker/generate.js'],
    },
    devtool: 'inline-source-map',
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
        new webpack.DefinePlugin({
          'VERSION': JSON.stringify(gitRevisionPlugin.version()),
          'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
          'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
          'LASTCOMMITDATETIME': JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
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
