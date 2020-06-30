const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpackConfig = {
  target: 'node',
  entry: {
    server: path.join(utils.APP_PATH, 'index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: utils.DIST_PATH
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: [path.join(__dirname, '../node_modules')]
      }
    ]
  },
  // 忽略node_modules文件夹中的所有模块
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod')
            ? `'production'`
            : `'development'`
      }
    })
  ],
  /**
   * 每个属性都是 Node.js 全局变量或模块的名称
   * true: 提供 polyfill
   * false: 不提供
   */
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  }
}

module.exports = webpackConfig
