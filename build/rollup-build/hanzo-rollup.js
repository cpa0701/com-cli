/**
 * hanzo 组件库打包，采用 rollup
 */
const path = require( 'path' );
const fs = require('fs');
const util = require('util');
const rollup = require('rollup');
const rm = require('rimraf');
const { terser } = require('rollup-plugin-terser');
const css = require('rollup-plugin-css-only'); // 提取css
const VuePlugin = require('rollup-plugin-vue');
const CleanCSS = require('clean-css'); // 压缩 css
const { inputOptions, outputOptions } = require( './build.config' );
const rmAsync = util.promisify(rm);

/**
 * 
 * @param {Object} config 项目配置
 */
const build = async ( config ) => {

    const buildConfig = config.build;
    const cwd = process.cwd();
    
    // 是否已有打包文件夹，有则删除
    const _distPath = path.resolve( cwd, buildConfig.dist );
    const isDist = fs.existsSync(_distPath);
    if ( isDist ) {
        await rmAsync(_distPath);
    }
    // 创建一个空文件夹，防止报错
    fs.mkdirSync(_distPath);

    const entryJs = path.resolve( cwd, config.main );
    inputOptions.input = entryJs;
    inputOptions.external = buildConfig.external;

    // 是否抽离 css
    if ( buildConfig.detachCss ) {
        inputOptions.plugins.push( VuePlugin({ css: false }) )
        inputOptions.plugins.push(
            css({ output(style) {
                fs.writeFileSync( path.resolve( process.cwd(), buildConfig.dist, `${ buildConfig.bundleNamePrefix }.min.css` ), new CleanCSS().minify(style).styles)
            } })
        )
    } else {
        inputOptions.plugins.push( VuePlugin({ css: true }) )
    }

    let bundle = null;
    for (let index = 0; index < buildConfig.fileFormat.length; index++) {

        let format = buildConfig.fileFormat[index];

        const outputDir = path.resolve( cwd, buildConfig.dist, `${ buildConfig.bundleNamePrefix }.${format}.js` );

        // 加上全局模块
        if( format === 'umd' || format === 'iife' ) {
            outputOptions.globals = {};
            buildConfig.external.map( ( item ) => {
                outputOptions.globals[item] = item;
            } );
        } else {
            delete outputOptions.globals;
        }

        outputOptions.file = outputDir;
        outputOptions.format = format;
        outputOptions.sourcemap = true;
        console.log( `正在打包 ${ buildConfig.bundleNamePrefix }.${format}.js` );
        bundle = await rollup.rollup(inputOptions);
        await bundle.write(outputOptions);
        console.log( `${ buildConfig.bundleNamePrefix }.${format}.js 打包完成` );

        // 压缩版
        if ( buildConfig.hasMin ) {
            outputOptions.file = path.resolve( cwd, buildConfig.dist, `${ buildConfig.bundleNamePrefix }.${format}.min.js` );
            outputOptions.plugins = [ terser({ keep_fnames: true }) ]; // 压缩可能造成与 vue 保留字段冲突，这个配置不处理函数名
            outputOptions.sourcemap = false;
            
            console.log( `正在打包${ buildConfig.bundleNamePrefix }.${format}.min.js` );
            bundle = await rollup.rollup(inputOptions);
            await bundle.write(outputOptions);
            console.log( `${ buildConfig.bundleNamePrefix }.${format}.min.js 打包完成` );

            delete outputOptions.plugins;
        }
    }

    

}

module.exports = {
    build
};