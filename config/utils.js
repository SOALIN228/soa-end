const path = require('path');

exports.resolve = function resolve(dir) {
  return path.join(__dirname, '..', dir);
};

exports.APP_PATH = exports.resolve('src');
exports.DIST_PATH = exports.resolve('dist');

exports.getWebpackResolveConfig = function (customAlias = {}) {
  const appPath = exports.APP_PATH;
  return {
    modules: [appPath, 'node_modules'], // 在以下目录查找文件
    extensions: ['.js', '.json'], // 不写后缀进行依次匹配
    alias: {
      '@': appPath,
      ...customAlias,
    },
  };
};
