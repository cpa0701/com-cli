const path = require( 'path' );
const fs = require( 'fs' );
const { staticStr, staticStrExport, componentListStr, exportStr } = require( '../common/template-string.js' );

/**
 * 导出格式化处理
 */
class exportFormat {

    /**
     * 
     * @param {Object} config 用户本地配置
     */
    constructor( config ) {
        this.config = config;
        // import str 拼接
        this.importStr = '';
        // 组件列表 str 拼接
        this.componentListStr = componentListStr;
        // export str 拼接
        this.exportStr = exportStr;
        // 拼接，并生成文件
        

        if( this.config.isSingle ) {
            this.exportSingleCom();
        } else {
            this.exportCom();
        }
    }

    /**
     * 组件导出
     */
    exportCom() {
        const comPath = path.resolve( process.cwd(), this.config.componentsDir );
        const indexPath = path.resolve( process.cwd(), this.config.main );

        // 最外层，遍历组件列表
        let comList = fs.readdirSync( comPath, 'utf-8' );
        comList.forEach( ( component ) => {
            let componentPath = path.resolve( comPath, component );
            let stat = fs.lstatSync( componentPath );
            if ( stat.isDirectory() ) {
                this.loopDir( componentPath, component );
            }
        } );

        // 拼装最终结果，并写入组件库最终导出文件
        const tem = this.importStr 
                    + '\n' + this.componentListStr + '];'
                    + '\n' + staticStr 
                    + this.exportStr + '}' 
                    + '\n' + staticStrExport;

        fs.writeFileSync( indexPath, tem );
    }

    /**
     * 单包组件导出
     */
    exportSingleCom() {
        const comPath = path.resolve( process.cwd(), this.config.componentsDir );

        // 最外层，遍历组件列表
        let comList = fs.readdirSync( comPath, 'utf-8' );
        comList.forEach( ( component ) => {
            let componentPath = path.resolve( comPath, component );
            let stat = fs.lstatSync( componentPath );
            if ( stat.isDirectory() ) {
                this.loopDir( componentPath, component );
                let indexPath = path.resolve( componentPath, 'install.js' );
                if ( !fs.existsSync( indexPath ) ) {
                    // 拼装最终结果，并写入组件库最终导出文件
                    const tem = this.importStr 
                                + '\n' + this.componentListStr + '];'
                                + '\n' + staticStr 
                                + this.exportStr + '}' 
                                + '\n' + staticStrExport;

                    fs.writeFileSync( indexPath, tem );
                }

                // 重置字符串
                this.importStr = '';
                this.componentListStr = componentListStr;
                this.exportStr = exportStr;
                
            }
        } );
    }

    /**
     * 依据组件文件处理导出导入格式
     * @param {String} comPath 组件路径
     * @param {String} component 组件名称
     */
    loopDir(comPath, component) {
        let comList = fs.readdirSync( comPath, 'utf-8' );
        let comName = '';
        // 如果有 index.js ，则是多组件导出
        if ( comList.includes( 'index.js' ) ) {
            const indexJsPath = path.resolve( comPath, 'index.js' );
            let indexStr = fs.readFileSync( indexJsPath, 'utf-8' );
            // 去掉空格，换行
            indexStr = indexStr.replace(/ +/g,"").replace(/[\r\n]/g,"");
            // 匹配导出的结果
            comName = indexStr.match( /export\{(\S*)\}/g )[0].replace('export{','').replace('}', '').replace(/[,]/g, ', ');
            
            this.importStr += this.config.isSingle ? `import { ${comName} } from './index.js';\n` : `import { ${comName} } from './${component}/index.js';\n`;
        } else {
            // 组件名称处理，横线改成驼峰，加前缀
            comName = this.humpName( component );
            this.importStr += this.config.isSingle ? `import ${comName} from './index.vue';\n` : `import ${comName} from './${component}/index.vue';\n`;
        }

        this.exportStr += `\t${comName},\n`;
        this.componentListStr += `\t${comName},\n`;
    }

    /**
     * 处理成驼峰命名
     * @param {String} name 未处理过的组件名称
     */
    humpName( name ) {
        let str = this.config.prefix;
        name = name.split('-');
        name.forEach( ( item ) => {
            item = item.slice(0, 1).toUpperCase() + item.slice(1);
            str+=item;
        } );

        return str;
    }
}
module.exports = {
    exportFormat
}