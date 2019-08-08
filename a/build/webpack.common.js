const path = require('path');
// 生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清空dist文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');

console.log("common:", process.env.NODE_ENV);
/* 
* name: 文件名
* chunks: 引入js文件名
*/
function getHtmlConfig(name, chunks) {
  return {
    template: `./src/views/${name}/${name}.pug`,
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    chunks: chunks,
    minify: process.env.NODE_ENV === "development" ? false : {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true, //去除属性引用
    }
  }
}

function getEntry() {
  var entry = {};
  //读取src目录所有views入口
  glob.sync('./src/views/**/*.js')
    .forEach((name) => {
      let start = name.indexOf('src/') + 4,
          end = name.length - 3;
      
      let eArr = [];
      let n = name.slice(start, end);

      n = n.slice(0, n.lastIndexOf('/')); 
      n = n.split('/')[1];
      eArr.push(name);
      entry[n] = eArr;
      // console.log("entry:", entry);
    });
  return entry;
};

module.exports = {
  entry: getEntry(),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  // 配置代码分离相关参数
  optimization: {
    splitChunks: {
      chunks: "async",
      // 最小30kb
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        common: {
          // 抽取出来的名称
          // test: /node_modules/,   // 匹配抽离部分
          name: 'common',
          chunks: 'initial',
          // 抽取权重（当业务复杂时，可根据具体业务配置该参数）
          priority: 2,
          // 最小被引入次数
          minChunks: 2,
        },
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin()
    // new HtmlWebpackPlugin({
    //   title: 'webpack-simple',
    //   template: './src/views/index/index.pug',
    //   filename: 'index.html',
    //   // script放在body最下面
    //   inject: true,
    //   // 按需引入js
    //   chunks: ['common', 'index']
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.pug$/,
        include: path.join(__dirname, '..', 'src'),
        loaders: [ 'pug-loader' ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};

// 配置页面，后面业务复杂时，如需按需引入公共js，可再做考虑
const entryObj = getEntry();
let htmlArray = [];
Object.keys(entryObj).forEach(element => {
  htmlArray.push({
    name: element,
    // title: '',
    chunks: ['common', element]
  })
})

// 生成html模板
htmlArray.forEach((element) => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element.name, element.chunks)));
})

