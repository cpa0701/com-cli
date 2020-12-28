<template>
  <div>
    <dialog-export
      :polling="polling"
      :download="download"
      :is-progress="true"
      :is-visible.sync="isOpen"
    />
    <!-- is-visible 是组件的开关,内部会修改,需要同步 -->
    <!-- progressValue ，内部会修改，需要同步 -->

    <el-button type="danger" size="mini" @click="showDialog"> open </el-button>
  </div>
</template>

<script>
import { DialogExport } from './index'
window.num = 0
export default {
  name: 'Test',
  components: { DialogExport },
  data() {
    return {
      type: 'primary',
      count: 1,
      polling: {
        baseURL: 'xsyxsc.com',
        url: '/webPayment/getProgress',
        method: 'post',
        adapter: (config) => {
          return new Promise((resolve) => {
            const res = {
              data: (window.num += 20),
              rspCode: 'success',
              rspDesc: ''
            }
            resolve(res)
          })
        }
      },
      download: {
        baseURL: 'xsyxsc.com',
        url: '/webPayment/downloadFile',
        data: {
          time: new Date()
        },
        start: false
      },
      isOpen: false
    }
  },
  methods: {
    showDialog() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    }
  },
  mounted() {
    window.fs = this
    console.log('test demo 加载完成')
  }
}
</script>
