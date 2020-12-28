/**
 * element table 扩展
 */
import ElementUi from 'element-ui'
import Mousewheel from 'element-ui/lib/directives/mousewheel'
import VirtualTableBodyRender from './virtual-table-body-render'

export default function(Table) {
  // element ui 版本检测
  function trans(version) {
    const versionNums = version.toString().split('.')
    let result = Array.from({ length: 3 })

    result = result
      .map((_, idx) => {
        const num = versionNums[idx]

        if (!num) {
          return '00'
        } else {
          return +num < 10 ? `0${num}` : num
        }
      })
      .join('')

    return +result
  }
  const newVersion = trans(ElementUi.version) >= trans(2.8)
  // 浏览器滚轮兼容插件
  const ElTableBody = Table.components.TableBody
  ElTableBody.directives = {
    Mousewheel
  }
  // 获取表格真实显示列表数据
  const oldDataComputed = ElTableBody.computed.data
  ElTableBody.computed.data = function() {
    const { table } = this
    const tableData = oldDataComputed.call(this)
    // 按可视范围读取数据即"分页读取" 分页截取数据
    if (table.useVirtual) {
      return tableData.slice(table.start, table.end)
    } else {
      return tableData
    }
  }

  // useVirtual 状态下重置 store.states.hoverRow 对象watch todo ?
  const oldHoverRowHandler =
    ElTableBody.watch && ElTableBody.watch['store.states.hoverRow']
  if (oldHoverRowHandler) {
    ElTableBody.watch['store.states.hoverRow'] = function(newVal, oldVal) {
      if (!this.table.useVirtual) {
        oldHoverRowHandler && oldHoverRowHandler.call(this, newVal, oldVal)
      }
    }
  }

  // 表体行索引
  ElTableBody.methods.getIndex = function(index) {
    return this.table.start + index
  }

  // 添加表格行滑过样式- 继承原始getRowClass扩展
  const oldGetRowClassHandler = ElTableBody.methods.getRowClass
  ElTableBody.methods.getRowClass = function(row, rowIndex) {
    let classes = oldGetRowClassHandler.call(this, row, rowIndex)
    if (
      this.table.useVirtual &&
      rowIndex === this.store.states.hoverRow &&
      (this.table.rightFixedColumns.length || this.table.fixedColumns.length)
    ) {
      // 兼容element-ui低版本
      if (
        newVersion &&
        Object.prototype.toString.call(classes) === '[object Array]'
      ) {
        classes.push('hover-row')
      } else if (typeof classes === 'string') {
        classes += ' hover-row'
      }
    }

    return classes
  }

  // 渲染x方向列
  ElTableBody.methods.isRenderCell = function(column, cellIndex) {
    const { table } = this
    const isFixedColumn = column.fixed
    const isFixedColumnInSideFixedBody = isFixedColumn && this.fixed
    const isInVisibleArea =
      cellIndex >= table.columnStart && cellIndex <= table.columnEnd

    return table.useVirtualColumn
      ? isInVisibleArea || isFixedColumnInSideFixedBody
      : !isFixedColumn || isFixedColumnInSideFixedBody
  }

  // 渲染y方向列
  const oldRender = ElTableBody.render
  ElTableBody.render = function(h) {
    if (this.table.useVirtual) {
      return VirtualTableBodyRender.call(this, h)
    } else {
      return oldRender.call(this, h)
    }
  }
}
