const match = require('minimatch')

// 根据一些选项，细致的配置模板的需要部分
// 原理：通过遍历filter规则，和files文件，满足条件的文件删去
module.exports = (files, filters, data, done) => {
  
  if (!filters) {
    return done()
  }

  const fileNames = Object.keys(files)
  // console.log('fileNames:', fileNames)
  Object.keys(filters).forEach(glob => {
    // 遍历filters规则
    fileNames.forEach(file => {
      // 遍历生成的所有文件，dot允许匹配.开头的文件
      if (match(file, glob, { dot: true })) {
        // condition是filters的value
        const condition = filters[glob]
        // console.log(eval(condition))
        if (!eval(condition)) {
          delete files[file]
        }
      }
    })
  })
  done()
}
