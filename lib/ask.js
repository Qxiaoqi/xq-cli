const inquirer = require('inquirer')
const async = require('async')

// 支持的类型，输入，ture/false，选择
const promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

/**
 * 问答，获得答案
 *
 * @param {Object} prompts
 * @param {Object} data
 * @param {Function} done
 */

module.exports = function ask (prompts, data, done) {
  // console.log("ask data:", data)
  // console.log("ask done:", done)
  async.eachSeries(Object.keys(prompts), (key, next) => {
    prompt(data, key, prompts[key], next)
  }, done)
}

/**
 * Inquirer prompt wrapper.
 *
 * @param {Object} data
 * @param {String} key
 * @param {Object} prompt
 * @param {Function} done
 */

function prompt (data, key, prompt, done) {
  // console.log("prompt data:", data)
  // console.log("prompt key:", key)

  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message,
    default: prompt.default || '',
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true)
  }]).then(answers => {
    // console.log('answers:', answers)
    if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  }).catch(done)
}
