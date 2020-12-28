<template>
  <div id="app">
    <brick-filter
      :view-brick="filterView"
      :http-action="request"
      @change="handleChange"
      @query="handleQuery"
    >
    </brick-filter>
  </div>
</template>

<script>
import { BrickFilter } from './index'
import viewConfig from './viewConfig'
export default {
  name: 'App',
  components: {
    BrickFilter
  },
  data() {
    return {
      filterView: viewConfig,
      request: {
        url: '/api/vendorCityEnumList',
        method: 'POST',
        options: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        },
        beforeRequest: (data) => {
          /* 对数据进行预处理，记得返回,内部可以使用this，已指向使用该amazing-filter组件的实例 */
          return data
        },
        success: this.success,
        fail: this.fail
      }
    }
  },

  created() {
    Object.freeze(this.filterView)
    Object.freeze(viewConfig)
  },
  methods: {
    handleChange(key, newVal, oldVal, filter) {
      console.table([
        `当前变更的字段为${key}`,
        `当前值为 ${newVal}`,
        `旧的值为 ${oldVal}`
      ])
      if (key === 'vendorCity') {
        filter.vendorPhoneNumber = '13723864387'
      }
      console.log(filter)
    },
    handleQuery(data) {
      console.log(data)
    },
    success(res) {
      console.warn(res)
    },
    fail(err) {
      console.warn(err)
    }
  },

  mounted() {}
}
</script>

