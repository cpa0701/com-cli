### v0.4.0-bate1 2020-07-16 更新
- 修复
    - babel-loader 排除 node_modules 导致的 jsx 语法解析失败

### v0.4.0 2020-07-15 更新
- 新增
    - hanzo build 打包命令新增参数 -w / --webpack
        - -w / --webpack : webpack 打包方式，支持 ts, jsx 的打包，仅打包为 umd 格式。
        - 默认: rollup 打包方式，不支持 ts, jsx 的打包

### v0.3.7 2020-07-10 更新
- 修复
    - 修改 .gitignore 文件

### v0.3.6 2020-07-07 更新
- 新增
    - hanzo.config 配置新增 pxtorem 字段：
        - 是否开启 px 转 rem，基准屏幕 375，移动端专用，默认 false

### v0.3.5 2020-05-15 更新
- 修复
    - babel-loader 排除 node_modules 导致的 jsx 语法解析失败

### v0.3.4 2020-05-14 更新
- 修复
    - 清除已有打包，修复打包文件夹不存在的报错
- 新增
    - loader 新增 vue-jsx 语法解析

### v0.3.3 2020-05-09 更新
- 新增
    - hanzo.config.js 新增 `cssLoader` 字段，可指定模板 css 预编译语言，目前支持 less、scss.
    - hanzo init 命令新增参数 -m，用于指定初始化的组件模板是否是多组件.