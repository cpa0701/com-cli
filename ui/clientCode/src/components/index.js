import heEditCell from './edit-cell/index.vue'
import { heFlowChart } from './flow-chart/index.js'
import { HeIconfont } from './iconfont/index.js'
import { HeIframe } from './iframe/index.js'
import { HePage } from './page/index.js'
import { HePanel } from './panel/index.js'
import { HeTableControl } from './table-control/index.js'
import { HeTableFilter } from './table-filter/index.js'
import { tableFilterCollapse } from './table-filter-collapse/index.js'
import { HeTableLayout } from './table-layout/index.js'
import { HeTablePagination } from './table-pagination/index.js'
import { HeTableVirtual } from './table-virtual/index.js'

const components = [
  heEditCell,
  heFlowChart,
  HeIconfont,
  HeIframe,
  HePage,
  HePanel,
  HeTableControl,
  HeTableFilter,
  tableFilterCollapse,
  HeTableLayout,
  HeTablePagination,
  HeTableVirtual
]

// 组件添加注册方法
components.forEach((component) => {
  component.install = function(Vue) {
    Vue.component(component.name, component)
  }
})

/**
 * 可全局注册使用
 */
const install = function(Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  heEditCell,
  heFlowChart,
  HeIconfont,
  HeIframe,
  HePage,
  HePanel,
  HeTableControl,
  HeTableFilter,
  tableFilterCollapse,
  HeTableLayout,
  HeTablePagination,
  HeTableVirtual
}

export default {
  install
}
