/**
 * proxyNPM
 * 代理 npm 安装，更新 package-hanzo.json
 */
const path = require( 'path' );
const fs = require( 'fs' );

const pkgPath = path.resolve( __dirname, '../ui/package.json' );
const localPkgPath = path.resolve( process.cwd(), 'package.json' );

/**
 * 更新项目本地依赖
 * @param { Array<String> } pkgName 依赖数组
 */
const localDepend = ( pkgName ) => {
    const json = require( pkgPath );
    let localJson = require( localPkgPath );

    // cli 中的依赖
    let dependencies = json.dependencies;
    let devDependencies = json.devDependencies;

    // 项目中的新依赖
    let dep = {};
    let devDep = {}
    pkgName.map( ( item ) => {
        if ( dependencies[item] ) {
            dep[item] = dependencies[item];
        } else if ( devDependencies[item] ) {
            devDep[item] = devDependencies[item];
        }
    } );

    let isExist = fs.existsSync( localPkgPath );

    if ( !isExist ) {
        localJson.dependencies = dep;
        localJson.devDependencies = devDep;
    } else {
        localJson = require( localPkgPath );
        localJson.dependencies = Object.assign( {}, localJson.dependencies, dep );
        localJson.devDependencies = Object.assign( {}, localJson.devDependencies, devDep );
    }
    
    let str = JSON.stringify( localJson, null, '\t' );
    fs.writeFileSync( localPkgPath, str );
}

/**
 * 按照项目本地依赖，重组模板项目 package.json 用于安装依赖
 */
const regroupPkg = () => {
    const temJson = require( pkgPath );
    const localJson = require( localPkgPath );

    temJson.dependencies = Object.assign( {}, localJson.dependencies );
    temJson.devDependencies = Object.assign( {}, localJson.devDependencies );

    
    let str = JSON.stringify( temJson, null, '\t' );
    fs.writeFileSync( pkgPath, str );
}

module.exports = {
    localDepend,
    regroupPkg
};
