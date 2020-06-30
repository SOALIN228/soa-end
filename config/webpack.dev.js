const webpackMerge = require('webpack-merge')

const commonWebpackConfig = require('./webpack.common')

const webpackConfig = webpackMerge(commonWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  // 不显示日志信息
  stats: { children: false }
})

module.exports = webpackConfig
