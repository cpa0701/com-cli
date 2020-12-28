module.exports = [
  {
      test: /\.css/,
      use: ['style-loader', 'css-loader'] // style-loader 和css-loader 编译css处理
  },
  {
      test: /\.scss/,
      use: ['style-loader', 'css-loader', 'sass-loader'] // 编译 scss 处理
  },
  {
      test: /\.less/,
      use: ['style-loader', 'css-loader', 'less-loader'] // 编译 less 处理
  }
]