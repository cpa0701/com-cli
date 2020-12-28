// 基本参数
const BASECONFIG = {
    configName: 'hanzo.config.js'
}

// 默认配置
const defaultConfig = {
    // 主入口路径，包含本地依赖等
    mainDir: 'src',
     // 组件路径
    componentsDir: 'src/components',
     // 组件统一入口和出口路径
    main: "src/components/index.js",
    // 组件前缀
    prefix: "h",
    // 使用的 css 预编译语言
    cssLoader: 'less',
    // 组件库类型, 是不是分包发，还是整包发
    isSingle: false,
    // 是否开启 px 转 rem，基准屏幕 375，移动端专用
    pxtorem: false,
    build: {
        // 构建文件路径
        dist: "dist",
        // 构建文件名称前缀
        bundleNamePrefix: 'hanzo',
        // 构建格式
        fileFormat: [ 'amd', 'cjs', 'umd', 'esm' ],
        // 是否压缩
        hasMin: true,
        // 是否分离 css 为单独文件
        detachCss: true,
        // 忽略打包文件
        external: [ 'vue' ]
    },
    devServer: {

    }
};

module.exports = {
    defaultConfig,
    BASECONFIG
};