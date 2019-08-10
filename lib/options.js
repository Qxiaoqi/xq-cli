const metadata = require('read-metadata')
const path = require('path')
const exists = require('fs').existsSync

module.exports = function options (name, dir) {
  const opts = getMetadata(dir)

  // 设置问答默认值（修改opts实现）
  setDefault(opts, 'name', name)

  return opts
}

/**
 * 获取meta.js或者meta.json文件
 *
 * @param  {String} dir
 * @return {Object}
 */

// 读取meta.json或者meta.js文件配置
function getMetadata (dir) {
  // console.log('dir:', dir)
  // 直接获取本地模板配置
  const json = path.join(dir, 'meta.json')
  const js = path.join(dir, 'meta.js')
  // const json = undefined
  // console.log('js:', js)
  let opts = {}

  if (exists(json)) {
    opts = metadata.sync(json)
  } else if (exists(js)) {
    const req = require(path.resolve(js))
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object')
    }
    opts = req
  }

  return opts
}

function setDefault (opts, key, val) {
  const prompts = opts.prompts || (opts.prompts = {})
  prompts[key]['default'] = val
}