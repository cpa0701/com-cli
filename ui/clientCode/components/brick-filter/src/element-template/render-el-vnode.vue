<script>
import { api } from '../util'
import dayjs from 'dayjs'
export default {
  name: 'RenderFactory',
  props: {
    config: Object,
    vModel: [Object, String, Number, Array]
  },
  data() {
    return {
      localVal: '',
      /* 用于保存 请求获取到的 select 的 options */
      remoteData: [],
      /* 在响应式的render函数中 确保只会请求一次 */
      singleFetchCount: 0
    }
  },
  created() {
    this.localVal = this.vModel
  },
  watch: {
    localVal(newval) {
      /* watch 就是良好的钩子，对 datetimerange 类型对数据做处理 */
      if (
        this.config.type === 'datetimerange' &&
        this.config.timeBetween &&
        newval
      ) {
        newval[0] = dayjs(newval[0]).format('YYYY-MM-DD 00:00:00')
        newval[1] = dayjs(newval[1]).format('YYYY-MM-DD 23:59:59')
      }
      if (
        ['daterange', 'datetimerange'].includes(this.config.type) &&
        this.config.limit > 0 &&
        newval
      ) {
        const s = dayjs(newval[0]).valueOf()
        const e = dayjs(newval[1]).valueOf()
        let x = Math.floor((e - s) / (60 * 60 * 24 * 1000))
        Object.prototype.hasOwnProperty.call(this.config, 'timeBetween')
          ? (x += 1)
          : undefined
        if (x > Math.floor(this.config.limit)) {
          this.$message({
            type: 'warning',
            message: `日期跨度不得大于 ${Math.floor(this.config.limit)} 天`,
            showClose: true
          })
          this.localVal = ['', '']
          this.$emit('update:vModel', this.localVal)
          return
        }
      }
      if (
        this.config.component === 'picker' &&
        ['daterange', 'datetimerange'].includes(this.config.type) &&
        !newval
      ) {
        this.localVal = ['', '']
        this.$emit('update:vModel', this.localVal)
        return
      }
      this.$emit('update:vModel', newval)
    },
    vModel(newval) {
      /* 传入的标识为 v-model 的值并没有被我在此组件中直接使用到
       * 而是间接的使用了 本地址 localVal
       * 所以要在此处 watch 赋值给本地变量
       */
      this.localVal = newval
    }
  },
  render(h) {
    const that = this

    const ACTIONS = {
      input: () => {
        return h('el-input', {
          props: {
            clearable: true,
            value: that.localVal
          },
          attrs: {
            placeholder: that.config.label
          },
          on: {
            input: value => {
              /* render 函数中 表单双向绑定的真谛就是处理input事件
               * render 函数的 官方示例也是如此
               * 依赖的  element 官方也表示需要处理 input 事件
               * 此处的  input 事件并非原生事件，是经过 element 抛出后的事件
               * 入参写  value 是因为拿到的不是 InputEvent ，而是经过处理后的值
               */

              that.localVal = value
            }
          }
        })
      },
      select: () => {
        return h(
          'el-select',
          {
            props: {
              clearable: true,
              value: that.localVal,
              filterable: that.remoteData.length > 7,
              multiple: that.config.multiple,
              'collapse-tags': true
            },
            attrs: {
              placeholder: that.config.label
            },
            on: {
              input: value => {
                that.localVal = value
              }
            }
          },
          [
            ...(Array.isArray(that.config.options)
              ? _SELECT_OPTIONS(that.config.options)
              : _FETCH_SELECT_OPTIONS(that.config.options))
          ]
        )
      },
      picker: () => {
        return h('el-date-picker', {
          props: {
            clearable: true,
            value: that.localVal,
            type: that.config.type,
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            format: _DATE_FORMAT(that.config),
            'value-format': _DATE_FORMAT(that.config)
          },
          class: {
            'short-picker': !!['datetime', 'date'].includes(that.config.type)
            // "short-picker":true
          },
          attrs: {
            placeholder: that.config.label
          },
          on: {
            input: value => {
              that.localVal = value
            }
          }
        })
      },
      object: () => {
        /**
         *  如果是组件过来，那么则是作为子组件
         *  组件的直接渲染，响应式绑定不是通过处理input事件，而是处理自定义事件
         *  所以自定义 change 事件传入子组件，
         *  一定要在子组件内部 emit 此注入的 change事件，此处的 render factory 才能代理将值 dispatch 到父级表单
         * */
        return h(that.config.component, {
          props: {
            clearable: true,
            vModel: that.localVal
          },
          on: {
            change: value => {
              that.localVal = value
            }
          }
        })
      }
    }

    const _SELECT_OPTIONS = source => {
      const VNodeList = []
      source.forEach((item, index) => {
        VNodeList.push(
          h('el-option', {
            props: {
              label: item.text,
              value: item.value
            },
            key: index
          })
        )
      })

      return VNodeList
    }
    const _FETCH_SELECT_OPTIONS = source => {
      const { url, params, options = {}} = source
      /* 受响应式数据 remoteData 的影响，如果不加判断会无限触发fetch，
       * 再fetch赋值给响应式数据又会触发重新渲染
       */
      /**
       * 这个函数 只能返回 另外一个函数的结果
       */
      if (that.remoteData.length !== 0) {
        /* 有值，直接去构造 options */
        return _SELECT_OPTIONS(that.remoteData)
      } else if (that.singleFetchCount === 0) {
        /* 累加器 最大为 1 */
        that.singleFetchCount += 1
        Object.freeze(that.singleFetchCount)
        /* 无值，去fetch 远程 options */
        debugger
        api[source.method.toLowerCase()](url, params, options).then(res => {
          that.remoteData = source.fit(res)
        })
      }
      return _SELECT_OPTIONS(that.remoteData)
    }
    const _DATE_FORMAT = ({ type }) => {
      switch (type) {
        case 'date':
          return 'yyyy-MM-dd'
        case 'daterange':
          return 'yyyy-MM-dd'
        case 'datetime':
          return 'yyyy-MM-dd HH:mm:ss'
        case 'datetimerange':
          return 'yyyy-MM-dd HH:mm:ss'
      }
    }
    const TYPES =
      typeof that.config.component === 'object'
        ? 'object'
        : that.config.component
    return ACTIONS[TYPES || 'input']()
  }
}
</script>
