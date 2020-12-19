const webpackMerge = require('webpack-merge');
const commonWebpackConfig = require('./webpack.common');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const webpackConfig = webpackMerge(commonWebpackConfig, {
  mode: 'production',
  // 不显示日志信息
  stats: { children: false, warnings: false },
  optimization: {
    minimizer: [
      // 压缩js代码
      new TerserWebpackPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            // 是否注释掉console
            drop_console: false,
            dead_code: true,
            drop_debugger: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
          mangle: true,
        },
        parallel: true,
        sourceMap: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true,
        },
      },
    },
  },
});

module.exports = webpackConfig;
