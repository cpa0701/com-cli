#!/usr/bin/env node

const path = require( 'path' );
const fs = require( 'fs' );

const program = require( 'commander' );
const chalk = require( 'chalk' );
const ora = require('ora');
const util = require('util');
const rm = require('rimraf');

const pkg = require('../package.json');
const Server = require( '../server/index' );
const { defaultConfig, BASECONFIG } = require( '../hanzo.config' );
const { watchFile, createVueFile, copyFile } = require( '../fileTools/index' );
const { localDepend, regroupPkg } = require( '../fileTools/proxy' );
const { exportFormat } = require( '../fileTools/export' );
const { webpackBuild, rollupBuild } = require('../build/index');

const _ = require('lodash');

// shelljs
const shell = require('shelljs');

const rmAsync = util.promisify(rm);

class HanzoCli {
    /**
     * 构造函数
     */
    constructor() {
        this.pwd = process.cwd();
        this.config = this.readConfig();
        this.command();
    }

    command() {
        // 版本
        program.version( pkg.version, '-v --version' );

        // 格式化组件导出
        program.command( 'format' )
            .alias( 'f' )
            .action( () => {
                new exportFormat( this.config );
            } ); 

        // 初始化项目
        program.command( 'init [name]' )
            .alias( 'i' )
            .option('-m, --multiple', '是否需要多组件模板')
            .action( ( name, opt ) => {
                this.copyTemplate( this.config,  name ? name : 'button', opt.multiple? 'multiple' : 'single' );
            } ); 

        
        // 运行项目
        program.command( 'run [name]' )
            .action( async ( name ) =>{
                // 如果指定组件，则导出空路由
                if ( name ) {
                    const routerListPath = path.resolve( __dirname, '../ui/router', 'routerList.js' );
                    fs.writeFileSync( routerListPath, 'export default [];' );
                }
                await watchFile( this.config, name );
                createVueFile(name, this.config);
                
                // 粗暴的解决方案，后续用异步代替
                setTimeout( () => {
                    new Server( this.config );
                }, 1200 );
            } ); 

        // 运行示例模板
        program.command( 'demo' )
            .alias( 'd' )
            .action( () =>{
                // TODO 展示 demo
                console.log( '展示 demo' );
            } ); 

        // 代理 npm install
        program.command( 'install' )
            .usage('<package ...>')
            .option('-S, --save', '依赖')
            .option('-g, --global', '全局依赖')
            .option('-D, --dev', '开发依赖')
            .action( async ( opt, pkgName ) =>{
                const projectPath = path.resolve( __dirname, '../ui' );
                await this.syncNpmrc();
                shell.cd( projectPath );
                if ( pkgName ) {
                    // 指定依赖名称安装
                    let model = opt.global ? '-g' : opt.dev ? '-D' : '-S';
                    let pkgStr = pkgName.join(' ');
                    const code = shell.exec( `npm i ${ pkgStr } ${ model }`, { silent:false } ).code;

                    if ( code === 0 ) {
                        localDepend( pkgName );
                    }
                } else {
                    // 按照依赖列表安装，清除缓存
                    shell.rm('-rf', 'node_modules');
                    shell.rm('-rf', 'package-lock.json');
                    regroupPkg();
                    const spinner = ora( chalk.black.bgWhite.bold('正在下载依赖，请稍后....') );
                    spinner.start();
                    const code = shell.exec( 'npm i', { silent:false } ).code;
                    if ( code === 0 ) {
                        spinner.stop();
                        console.log("下载完成！");
                    }
                }
            } ); 
        
        // 构建
        program.command( 'build' )
        .alias( 'b' )
        .option('-w, --webpack', '使用 webpack 打包')
        .action( ( opt ) =>{
            // 保留 rollup 构建，提供参数选择
            if ( opt.webpack ) {
                webpackBuild( this.config );
            } else {
                rollupBuild( this.config );
            }
        } ); 
        
        // 发布
        program.command( 'public' )
        .alias( 'p' )
        .action( () =>{
            // TODO 组件发布
        } ); 

        program.parse( process.argv );
    }

    // 获取配置文件
    readConfig() {
        let config = {};
        const customConfigPath = path.resolve( this.pwd, BASECONFIG.configName );
        const isExistFile = fs.existsSync( customConfigPath );

        if ( isExistFile ) {
            const customConfig = require( customConfigPath );
            config = _.merge( defaultConfig, customConfig );
        } else {
            config = Object.assign( {}, defaultConfig );
        }
        
        return config;
    }

    /**
     * 复制模板到项目
     * @param {Object} config 配置
     * @param {String} type 类型
     * @param {String} name 名称
     */
    copyTemplate( config, name, type ) {
        let fileUrl = path.resolve( process.cwd(), config.componentsDir, name );
        let templateUrl = path.resolve( __dirname, '../template', `${config.isSingle?'single':'total'}`,config.cssLoader, type );
        copyFile( templateUrl, fileUrl );
    }

    /**
     * 同步项目中的 .npmrc 文件
     */
    async syncNpmrc() {
        let npmrcPath = path.resolve( process.cwd(), '.npmrc' );
        let targetNpmrcPath = path.resolve( __dirname, '../ui', '.npmrc' );

        // 清除已有 .npmrc 缓存
        if ( fs.existsSync( targetNpmrcPath ) ) {
            await rmAsync( targetNpmrcPath );
        }

        // 如果有，再同步
        if ( fs.existsSync( npmrcPath ) ) {
            copyFile( npmrcPath, targetNpmrcPath );
        }
    }
}

new HanzoCli();