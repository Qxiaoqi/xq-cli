const chalk = require('chalk')
// 传入方法，生成目标文件
const Metalsmith = require('metalsmith')
const path = require('path')

/**
 * 在目标位置生成模板
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate (name, src, dest, done) {
  // src: .xq-template/webpack-template/template
  const metalsmith = Metalsmith(path.join(src, 'template'))
  metalsmith
    .clean(false)
    .source('.') // 修改源项目路径
    .destination(dest)
    .build(function(err) {
      if (err) throw err;
      console.log('Build finished!');
    });
}