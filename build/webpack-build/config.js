const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const nodeExternals = require('webpack-node-externals');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// 依赖分析，暂时不需要
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackConfig = {
    mode: 'production',
    entry: '',
    context: __dirname,
    output: {
        path: path.resolve( process.cwd(), 'dist' ),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'lib',
        umdNamedDefine: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                include: /min/,
                sourceMap: true
            })
        ]
    },
    module: {
        rules: [
            // 以及 `.vue` 文件中的 `<script>` 块
            // todo 可优化让用户配置文件babel
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, '../../ui/clientCode')
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
    ],
    resolve: {
        extensions: ['.vue', '.js', '.ts']
    },
    externals: [ nodeExternals() ]
};

module.exports = webpackConfig;