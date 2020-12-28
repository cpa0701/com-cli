const fs = require( 'fs' );
const path = require( 'path' );
const chokidar = require('chokidar'); // 文件监听
const util = require('util');
const rm = require('rimraf');
const { appRouterStr } = require( '../common/template-string' );

const rmAsync = util.promisify(rm);

/**
 * 检查路径是否存在，不存在要创建
 * @param { String } target 目标路径
 */
const syncPath = ( target ) => {
    let checkPath = path.resolve( __dirname, '../ui/clientCode' );
    const filePath = target.split( path.sep );

    filePath.forEach(( fileDir )=>{
        checkPath = path.resolve( checkPath, fileDir );
        if ( !fs.existsSync( checkPath ) ) {
            fs.mkdirSync( checkPath );
        }
    })
}

/**
 * 复制文件夹
 * @param { String } from 文件原路径
 * @param { String } to 文件目标路径
 */
const copyFile = ( from, to ) => {
    let stat = fs.lstatSync( from );

    if ( stat.isDirectory() ) {
        if ( !fs.existsSync( to ) ) {
            fs.mkdirSync( to );
        }
        const fileList = fs.readdirSync( from,'utf-8' );
        fileList.forEach((file)=>{
            let source = path.resolve( from, file );
            let target = path.resolve( to, file );
            copyFile( source, target )
        })
    } else {
        fs.copyFileSync( from, to );   
    }
}

/**
 * 嵌套路径复制
 * @param { String } from 原路径
 * @param { String } to 目标路径
 * @param { String } root 跟目录
 * @param { String } relativePath 相对路径
 */
const deepFileCopy = ( from, to, root ,relativePath ) => {
    const dirParse = path.parse(relativePath);
    const filePath = dirParse.dir.split( path.sep );
    let checkPath = root;
    filePath.forEach(( fileDir )=>{
        checkPath = path.resolve( checkPath, fileDir );
        if ( !fs.existsSync( checkPath ) ) {
            fs.mkdirSync( checkPath );
        }
    })
    let stat = fs.lstatSync( from );
    if ( !stat.isDirectory() ) {
        fs.copyFileSync( from, to );
    }
}

/**
 * 监听文件
 * @param { Object } config 配置
 */
const watchFile = async ( config, name ) => {
    const cwd = process.cwd();
    const sourcePath = path.resolve( cwd, config.mainDir ); 
    const targetPath = path.resolve( __dirname, '../ui/clientCode', config.mainDir );
    let routerList = [];
    let demoRelativePath = '';
    let hasChangeDemo = false;

    // 清除缓存
    const hasCache = fs.existsSync( targetPath );
    if ( hasCache ) {
        await rmAsync( targetPath );
    }
    // 解决主路径不存在问题
    syncPath( config.mainDir );
    // 原文件复制
    copyFile( sourcePath, targetPath );

    // 监听文件
    const watcher = chokidar.watch( sourcePath );
    watcher.on('all', async ( event, clientPath ) => {
        let relativePath = clientPath.replace( sourcePath, '' );
        let _targetPath = path.resolve( targetPath, `.${relativePath}` );
        hasChangeDemo = false
        
        // 含有 demo.vue, 生成 router.js
        if ( relativePath.indexOf('demo.vue') != -1 && !name ) {
            let sep = relativePath.split(path.sep);
            demoRelativePath = sep[sep.length-2];
        }

        if( event === 'add' || event === 'addDir' || event === 'change' ) {
            deepFileCopy( clientPath, _targetPath, targetPath, relativePath );
            
            if ( !routerList.includes( demoRelativePath ) && !name ) {
                routerList.push( demoRelativePath );
                hasChangeDemo = true;
            }

        } else if ( event === 'unlink' || event === 'unlinkDir' ) {
            await rmAsync( _targetPath );
            
            if ( routerList.includes( demoRelativePath ) && !name ) {
                routerList = routerList.filter(function(item) {
                    return item != demoRelativePath
                });
                hasChangeDemo = true;
            }
        }

        // demo 文件变化才重写 routerList.js
        if ( hasChangeDemo && !name ) {
            createRouterFile( routerList, config );
        }
    } )
};

const createRouterFile = ( demoList, config ) => {
    const routerListPath = path.resolve( __dirname, '../ui/router', 'routerList.js' );
    let importStr = '';
    let mapStr = '';
    demoList.map( ( item, index ) => {
        if ( item ) {
            let humpName = '';
            let nameList = item.split('-');
            nameList.forEach( ( i ) => {
                i = i.slice(0, 1).toUpperCase() + i.slice(1);
                humpName+=i;
            } );
            importStr += `import ${humpName} from '../clientCode/${config.componentsDir}/${item}/demo.vue';\n`;
            if ( index === 1 ) {
                mapStr += `
    {
        path: '',
        redirect: '/${item}',
        component: ${ humpName }
    },`;
            }

            mapStr += `
    {
        path: '/${item}',
        name: '${ item }',
        component: ${ humpName }
    },`;
        }
    } );

    const routerFinal = importStr 
                        + '\n' + `const constantRouterMap = [`
                        + mapStr + '\n' + `] \n`
                        + `export default constantRouterMap;`;
    fs.writeFileSync( routerListPath, routerFinal );
}

/**
 * 创建 vue 入口文件
 * @param { String } name 文件名
 */
const createVueFile = ( name, config ) => {

    const entryPath = path.resolve( __dirname, '../ui/src/app.vue' );
    let tem = '';
    if ( name ) {
        const demoPath = `../clientCode/${ config.componentsDir }/${name}/demo.vue`;
        tem = `
<template>
    <div>
        <demo></demo>
    </div>
</template>
<script>
import demo from '${demoPath}';
export default {
    name: "app",
    components: {
        demo
    },
    data() {
        return {
        };
    },
};
</script>
<style>
</style>   
`
    } else {
        tem = appRouterStr;
    }

    fs.writeFileSync( entryPath, tem );
}

module.exports = {
    copyFile,
    watchFile,
    createVueFile
};
