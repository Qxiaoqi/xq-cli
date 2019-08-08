const chalk = require('chalk')

// 正常输出信息
exports.log = function(...args) {
  let msg = args.join(' ')
  console.log(chalk.blue('info: ') + msg)
}

// 错误输出信息
exports.fatal = function(...args) {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  let msg = args.join(' ')
  console.log(chalk.red('error: ') + msg)
}

// 成功输出信息
exports.success = function(...args) {
  let msg = args.join(' ')
  console.log(chalk.green('success: ') + msg)
}

// 警告输出信息
exports.warnning = function(...args) {
  let msg = args.join(' ')
  console.log(chalk.yellow('warnning: ') + msg)
}