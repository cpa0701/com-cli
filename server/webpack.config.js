const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const webpackConfig = {
    context: __dirname,
    mode: 'development',
    entry: path.resolve( __dirname, '../ui/src/index.js' ),
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader' //vue-loader 编译vue模块
            },
            // 以及 `.vue` 文件中的 `<script>` 块
            // todo 可优化让用户配置文件babel
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, '../ui/clientCode')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            [
                                require('@babel/preset-env')
                            ]
                        ],
                        plugins: [
                            require('babel-plugin-transform-vue-jsx'),
                            require('@babel/plugin-transform-runtime')
                        ]
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options:Object.assign({},{
                    limit: 10000
                })
            },
            // 字体加载
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'url-loader',
                options:Object.assign({},{
                    limit: 10000
                })
            },
            // ts
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    // appendTsSuffixTo: [/\.vue$/],
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(), //vue-loader插件开启
        new HtmlWebpackPlugin({ // 构建html
            filename: 'index.html', //文件名
            title: '组件库示例', //title
            template: path.resolve( __dirname, '../ui/index.html'), //参照模板样式
        }),
        new FriendlyErrorsWebpackPlugin(
            {
                compilationSuccessInfo: {
                    messages: ['You application is running'],
                    notes: ['Some additionnal notes to be displayed unpon successful compilation']
                }
            }
        )
    ],
    resolve: {
        extensions: ['.vue', '.js', '.ts']
    },
    devServer: {
        publicPath: '/',
        proxy:{},
        historyApiFallback: true,
        hot: true,
        compress: true,
        open: true,
        quiet: true, // 屏蔽错误信息，慎用
        watchOptions: {
            poll: false
        },
        host: '127.0.0.1',
        port: 2000,
    }
};

module.exports = webpackConfig;