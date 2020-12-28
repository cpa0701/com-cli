<template>
  <div class="amazing-wrapper">
    <data-filter
      :config="viewBrick"
      @change="handleChange"
      @query="handleQuery"
    ></data-filter>
  </div>
</template>

<script>
import DataFilter from './child/data-filter'
import { api, _deepClone } from './util'
export default {
  name: 'BrickFilter',
  props: {
    viewBrick: {
      required: true,
      type: Array
    },
    httpAction: {
      required: false,
      validator: function(value) {
        const needKeys = ['url', 'method', 'options', 'success', 'fail', 'beforeRequest']

        for (const key in value) {
          if (!needKeys.includes(key)) {
            throw new Error(
              `http-request 对象预期可具有五个key，["url","method", "options","success","fail","beforeRequest"]`
            )
          }
        }
        const _method = value.method.toUpperCase()
        if (!(value.method && ['GET', 'POST'].includes(_method))) {
          throw new Error(`请求方法 只支持 GET POST `)
        }

        return true
      }
    }
  },
  components: {
    DataFilter
  },
  data() {
    return {}
  },

  methods: {
    handleChange(key, newValue, oldValue, filter) {
      this.$emit('change', key, newValue, oldValue, filter)
    },
    async handleQuery(data, notNeedKey) {
      /* 洗数据 */
      const cleanData = _deepClone(data)
      notNeedKey.forEach(item => {
        delete cleanData[item]
      })
      /* 出去的值是纯净的，不能双向操作的，并且不包含表单查询不需要的值 */
      this.$emit('query', cleanData)

      const { url, method, options, beforeRequest } = this.httpAction || {}
      /* 预处理数据 */
      const finallyData = beforeRequest ? beforeRequest.call(this.$parent, cleanData) : cleanData

      const that = this
      this.httpAction &&
        api[method.toLowerCase()](url, finallyData, options)
          .then(res => {
            that.httpAction.success && that.httpAction.success(res)
          })
          .catch(err => {
            that.httpAction.fail && that.httpAction.fail(err)
          })
    }
  }
}
</script>
<style lang="scss" scoped>
.amazing-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
}
</style>
