/**
 * hanzo 组件库打包
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const rm = require('rimraf');
const util = require('util');

// wenpack plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const { copyFile } = require('../../fileTools/index');
const webpackConfig = require('./config');
// css 打包 loader
const includeCss = require('./loader-config/include-css');
const extracCss = require('./loader-config/extrac-css');

const rmAsync = util.promisify(rm);

/**
 * 
 * @param {Object} config 项目配置
 */
const build = async ( config ) => {

  const cwd = process.cwd();
  const buildConfig = config.build;
  const sourcePath = path.resolve( cwd, config.mainDir ); 
  const targetPath = path.resolve( __dirname, '../../ui/clientCode', config.mainDir );

  // 清除缓存
  const hasCache = fs.existsSync( targetPath );
  if ( hasCache ) {
      await rmAsync( targetPath );
  }

  // 复制文件
  copyFile( sourcePath, targetPath );

  // 处理入口路径, 定义两个，同时输出压缩和未压缩代码
  const entryJs = path.resolve( __dirname, '../../ui/clientCode', config.main );
  webpackConfig.entry = {
    [`${buildConfig.bundleNamePrefix}`]: entryJs,
    [`${buildConfig.bundleNamePrefix}.min`]: entryJs
  };

  // webpack rules
  let rules = webpackConfig.module.rules;

  // 是否抽离 css
  if ( buildConfig.detachCss ) {
    webpackConfig.module.rules = extracCss.concat( rules );
    webpackConfig.plugins.push( new ExtractTextPlugin(`${buildConfig.bundleNamePrefix}.css`) );
  } else {
    webpackConfig.module.rules = includeCss.concat( rules );
  }

  // 打包
  webpack( webpackConfig, (err, stats) => {
    if (err) throw err
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        entrypoints: false,
        hash: false
      }) + '\n\n'
    )


    if (stats.hasErrors()) {
        console.warn(' 构建出错.\n')
        process.exit(1)
    }

    console.log(' 构建成功.\n')
    console.log(' 提示: 本次构建由 hanzo-cli 提供，构建格式为 umd.\n')

  } )
}

module.exports = build;