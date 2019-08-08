const chalk = require('chalk')
// 传入方法，生成目标文件
const Metalsmith = require('metalsmith')
const path = require('path')
const getOptions = require('./options')
const ask = require('./ask')
const logger = require('./logger')


/**
 * 在目标位置生成模板
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate (name, src, dest, done) {
  const opts = getOptions(name, src)
  // src: .xq-template/webpack-template/template
  const metalsmith = Metalsmith(path.join(src, 'template'))
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd()
  })

  // 问答部分
  metalsmith.use(askQuestions(opts.prompts))

  metalsmith
    .clean(false)
    .source('.') // 修改源项目路径
    .destination(dest)
    .build((err, files) => {
      done(err)
      if (err) throw err;
      if (typeof opts.complete === 'function') {
        const helpers = { chalk, files }
        console.log('执行complete前')
        opts.complete(data, helpers)
      } else {
        logger.success('Build Success!')
      }
    });
}


/**
 * 创建一个中间ask件，注意这里闭包，返回的函数必备三个参数，文件，变量，回调
 *
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions (prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}
