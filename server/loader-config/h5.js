module.exports = [
  {
      test: /\.css/,
      use: [
          {
              loader: 'style-loader'
          },
          {
              loader: 'css-loader'
          },
          {
              loader: 'px2rem-loader',
              options: {
                remUnit: 37.5
              }
          }
          
      ] // style-loader 和css-loader 编译css处理
  },
  {
      test: /\.scss/,
      use: [
          {
              loader: 'style-loader'
          },
          {
              loader: 'css-loader'
          },
          {
              loader: 'px2rem-loader',
              options: {
                remUnit: 37.5
              }
          },
          {
              loader: 'sass-loader'
          }
      ] // 编译 scss 处理
  },
  {
      test: /\.less/,
      use: [
          {
              loader: 'style-loader'
          },
          {
              loader: 'css-loader'
          },
          {
              loader: 'px2rem-loader',
              options: {
                remUnit: 37.5
              }
          },
          {
              loader: 'less-loader'
          }
      ] // 编译 less 处理
  }
];