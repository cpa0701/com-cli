### Demo 组件

本组件提供远程数据模式来打开导出弹窗，传入请求配置，自动请求，两种模式，进度条模式，和 loading 转圈模式

作者：伍宇威

## 注意事项

- download

  > 组件内部 watch 了该对象，必须拥有以下属性才能正常运行 : [baseURL,url,data,start],
  > 在不确定接口数据的情况下（即不自动执行下载时 start 属性很重要，这个时候请手动赋值 start）
  > start = true 为立即使用该 download 配置进行请求,进度条模式下 值为 100 时，这个值自动变为 true
  > start = false 默认不自动请求

- isVisible
  > 改属性控制了组件是否挂载至 DOM （即是否渲染）

## 进度条模式

- 点击导出按钮，打开对话框，（ 让 isOpen = true 即可 ）
- 传入轮询进度条接口配置，自动轮询 （轮询接口只返回进度数字值）
- 传入最终下载的接口配置，自动流下载 （若要传数据那预计就是查询条件，绝对不会是轮询接口的数据）

```html
<dialog-export
  :polling="polling"
  :download="download"
  :is-progress="true"
  :is-visible.sync="isOpen"
/>
```

## 非进度条模式

- 点击导出按钮，打开对话框，（ 让 isOpen = true 即可 ）
- 对话框播放转圈动画，
  - 视导出为两步：
    第一步触发导出，可以在此处异步 得到 response，放到第二步的参数中，或者直接 让 isOpen = true 打开
    第二步下载文件，这个时候请配置好 download 对象，若该下载接口需要参数，预计就是第一步返回的参数

```html
<dialog-export
  :download="download"
  :is-progress="false"
  :is-visible.sync="isOpen"
/>
```
