import { DialogExport } from './index.js'

const components = [
  DialogExport
]

// 组件添加注册方法
components.forEach(component => {
  component.install = function(Vue) {
    Vue.component(component.name, component)
  }
})

/**
 * 可全局注册使用
 */
const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  DialogExport
}

export default {
  install
}
