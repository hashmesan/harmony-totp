const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
require("@babel/polyfill");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  devServer: {
    //contentBase: path.join(__dirname, "public"),
    compress: false,
  },
  node: {
    fs: "empty",
    child_process: "empty",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: path.resolve(
          __dirname,
          "./node_modules/bootstrap-icons/font/fonts"
        ),
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "webfonts",
            publicPath: "../webfonts",
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: { chunks: "all" },
  },
  entry: {
    main: ["@babel/polyfill", "./src/index.js"],
    worker: ["@babel/polyfill", "./src/worker/generate.js"],
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: false,
    }),
    new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin([{ from: "./public", to: "./public" }]),
  ],
};
