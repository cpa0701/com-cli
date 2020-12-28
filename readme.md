#### 安装
> npm install @xsyx/hanzo-cli -g

#### 命令
hanzo -v| --version       // 查看当前版本
      format|f            // 格式化组件导出文件，统一添加 install 全局方法
      init|i [name]       // 初始化组件，会自动执行 hanzo f,可指定组件名，默认为 button
      run [name]          // 运行组件，提供调试，可指定组件名，或运行所有组件
      install [options]   // 安装依赖，代理 npm 安装，保持组件项目纯净
      build|b             // 依据配置文件的配置来打包组件