const path = require('path');
const utils = require('./utils');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackConfig = {
  target: 'node',
  entry: {
    server: path.join(utils.APP_PATH, 'index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: utils.DIST_PATH,
  },
  resolve: {
    ...utils.getWebpackResolveConfig(),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: [path.join(__dirname, '../node_modules')],
      },
    ],
  },
  // 忽略node_modules文件夹中的所有模块
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
};

module.exports = webpackConfig;
