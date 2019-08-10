const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const async = require('async')
const path = require('path')
const getOptions = require('./options')
const ask = require('./ask')
const filter = require('./filter')
const logger = require('./logger')

// 注册模板
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})

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
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles())

  metalsmith
    .clean(false)
    .source('.') // 修改源项目路径
    .destination(dest)
    .build((err, files) => {
      done(err)
      if (err) throw err;
      if (typeof opts.complete === 'function') {
        const helpers = { chalk, files }
        opts.complete(data, helpers)
      } else {
        logger.success('Build Success!')
      }
    });
}


/**
 * 创建ask，注意这里闭包，返回的函数必备三个参数，文件，变量，回调
 *
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions (prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

/**
 * 创建filters
 *
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles (filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

function renderTemplateFiles () {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files)
    const metalsmithMetadata = metalsmith.metadata()
    async.each(keys, (file, next) => {
      const str = files[file].contents.toString()


      if (!/{{[^]+}}/g.test(str)) {
        // 如果文件中没有{{}}模板渲染部分，直接跳过
        return next()
      }
      render(str, metalsmithMetadata, (err, res) => {
        if (err) {
          err.message = `[${file}]${err.message}`
          return next(err)
        }
        files[file].contents = new Buffer(res)
        next()
      })
    }, done)
  }
}