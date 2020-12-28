const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
  {
      test: /\.css/,
      use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader']
      }) // style-loader 和css-loader 编译css处理
  },
  {
      test: /\.scss/,
      use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'sass-loader']
      })
  },
  {
      test: /\.less/,
      use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader']
      })
  },
  {
      test: /\.vue$/,
      loader: 'vue-loader', //vue-loader 编译vue模块
      options: {
          transformToRequire: {
              img: 'src',
              image: 'xlink:href',
              'source': 'src',
          },
          loaders: {
              css: ExtractTextPlugin.extract({
                  use: 'css-loader',
                  fallback: 'vue-style-loader'
              })
          }
      }
  }
];