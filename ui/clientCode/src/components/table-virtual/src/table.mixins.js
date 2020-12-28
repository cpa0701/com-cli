export default function(Table) {
  // 继承doLayout方法重置
  const oldDoLayoutHandler = Table.methods.doLayout
  Table.methods.doLayout = function(...arg) {
    oldDoLayoutHandler.call(this, ...arg)

    if (this.useVirtual && this.useVirtualColumn) {
      let position = 0

      this.columnsPosotion = this.columns.map(
        ({ realWidth = 0, width = 0, minWidth = 0 }, columnIdx) => {
          return [
            position,
            (position += Math.max(realWidth, width || minWidth))
          ]
        }
      )

      this.computeScrollToColumn(this.scrollLeft)
    }
  }

  return {
    props: {
      // 行高(必须要设置正确的行高，否则会导致表格计算不正确)
      rowHeight: {
        type: Number,
        default: 50
      },
      // 可视区域上方和下方额外渲染的行数，行数越多表格接替渲染效果越好，但越耗性能
      excessRows: {
        type: Number,
        default: 6
      },
      // 是否Y方向开启虚拟滚动
      useVirtual: {
        type: Boolean,
        default: false
      },
      // 大部分场景下可以不使用rowKey来最大化复用dom，极大的提升渲染效率
      useRowKey: Boolean,
      // 是否X方向开启虚拟滚动
      useVirtualColumn: {
        type: Boolean,
        default: false
      },
      // 最小显示数量（少量数据不足“分页”）需要配合高度一起使用
      minCount: {
        type: Number,
        default: 6
      }
    },
    data() {
      return {
        scrollTop: 0,
        scrollLeft: 0,
        columnsPosotion: {},
        innerTop: 0,
        start: 0,
        end: 0,
        columnStart: 0,
        columnEnd: 0
      }
    },
    computed: {
      // 可显示的列表项数 = Math.ceil(screenHeight / itemSize)
      visibleCount() {
        const dataTable = this.store.states.data
        if (dataTable && dataTable.length <= this.minCount) {
          // todo 解决单元格不满屏幕错误问题
          // this.$set(this.layout,'bodyWidth',this.layout.bodyWidth-this.layout.gutterWidth);
          return this.minCount
        } else {
          return Math.ceil(parseFloat(this.height) / this.rowHeight)
        }
      },
      // 虚拟（实际数据所有高度）
      virtualBodyHeight() {
        const { data } = this.store.states

        return data ? data.length * this.rowHeight : 0
      }
    },
    watch: {
      scrollTop: {
        immediate: true,
        handler(top) {
          this.computeScrollToRow(top)
        }
      },

      scrollLeft(left) {
        if (this.useVirtualColumn) {
          this.computeScrollToColumn(left)
        }
      },

      virtualBodyHeight() {
        if (this.useVirtual) setTimeout(this.doLayout, 10)
      },

      height() {
        if (this.useVirtual) this.computeScrollToRow(this.scrollTop)
      }
    },
    mounted() {
      if (this.useVirtual) {
        this.bindEvent('bind')
      }
    },
    activated() {
      if (this.useVirtual) {
        this.scrollTop = 0
        this.bindEvent('bind')
      }
    },
    deactivated() {
      if (this.useVirtual) {
        this.bindEvent('unbind')
      }
    },
    beforeDestroy() {
      if (this.useVirtual) {
        this.bindEvent('unbind')
      }
    },
    methods: {
      bindEvent(action) {
        const tableBodyWrapper = this.$el.querySelector(
          '.el-table__body-wrapper'
        )

        if (!this.binded && action === 'bind') {
          tableBodyWrapper.addEventListener('scroll', this.handleScroll)
          this.binded = true
        } else if (this.binded && action === 'unbind') {
          tableBodyWrapper.removeEventListener('scroll', this.handleScroll)
          this.binded = false
        }
      },

      computeScrollToColumn(scrollLeft) {
        let start = 0
        let end = this.columns.length
        let visibleWidth = 0
        const bodyWidth = this.$el.clientWidth

        for (let i = 0; i < this.columnsPosotion.length; i++) {
          const [left, right] = this.columnsPosotion[i]

          if (scrollLeft >= left && scrollLeft < right) {
            start = i
            visibleWidth = right - scrollLeft
          } else if (left > scrollLeft) {
            visibleWidth += right - left
          }

          if (visibleWidth + this.layout.gutterWidth >= bodyWidth) {
            end = i
            break
          }
        }

        this.columnStart = start
        this.columnEnd = end
      },

      computeScrollToRow(scrollTop) {
        const startIndex = parseInt(scrollTop / this.rowHeight)
        const { start, end } = this.getVisibleRange(startIndex)

        this.start = start
        this.end = end
        this.innerTop = this.start * this.rowHeight
      },
      // 获取可视窗口数据范围索引
      getVisibleRange(expectStart) {
        const start = expectStart - this.excessRows
        return {
          start: start >= 0 ? start : 0,
          end: expectStart + this.visibleCount + this.excessRows
        }
      },

      handleScroll(e) {
        const ele = e.srcElement || e.target
        let { scrollTop } = ele
        const { scrollLeft } = ele
        const bodyScrollHeight = this.visibleCount * this.rowHeight

        if (!this.useRowKey) {
          const focusItem = this.$el.querySelector(':focus')

          focusItem && focusItem.blur()
        }

        // 解决 滚动时 行hover高亮的问题
        this.store.states.hoverRow = null

        if (this.virtualBodyHeight < scrollTop + bodyScrollHeight) {
          scrollTop = this.virtualBodyHeight - bodyScrollHeight
        }

        if (parseInt(this.scrollTop) !== parseInt(scrollTop)) {
          this.scrollTop = scrollTop
        }

        if (parseInt(this.scrollLeft) !== parseInt(scrollLeft)) {
          this.scrollLeft = scrollLeft
        }
      }
    }
  }
}
