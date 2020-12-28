<template>
  <div>
    <component
      :is="component"
      :is-visible.sync="isVisible"
      :is-progress.sync="isProgress"
      :progress-value="progressValue"
      :title.sync="title"
    >
    </component>
  </div>
</template>

<script>
import DialogExport from './source'
import axios from 'axios'

export default {
  name: 'DialogExportDispatcher',
  props: {
    polling: {
      required: false,
      type: Object,
      validator: function(value) {
        const { baseURL, url, method } = value || {}
        if (!baseURL || !url || !method) {
          throw new Error('baseURL,url,method 必传')
        }
        return true
      }
    },
    download: {
      required: false,
      type: Object,
      default: function() {
        return {}
      }
      /* validator:function (value) {
                    let { baseURL,url,data } = value || {}
                    if (typeof value === "object" && !baseURL || !url || !data){
                        throw new Error("baseURL, url, data 必传")
                    }
                    return true
                }*/
    },
    title: {
      required: false,
      default: '正在导出,请勿重复提交或关闭 ...',
      type: [String]
    },
    isVisible: {
      required: false,
      default: false,
      type: [Boolean]
    },
    isProgress: {
      required: false,
      default: true,
      type: [Boolean]
    }
  },
  data() {
    return {
      component: '',
      dispatcher: '',
      timer: '',
      /* 如果连进度条值也暴露出去，那用这个组件的目的何在? */
      progressValue: 0
    }
  },
  watch: {
    isVisible(newVal) {
      if (!newVal) {
        this.close()
      } else {
        this.open()
      }
    },
    download: {
      deep: true,
      handler: function(value) {
        const { baseURL, url, data, start } = value || {}
        if (baseURL && url && data && start) {
          this.doRequestDownFile()
        }
      }
    }
  },
  methods: {
    open() {
      this.component = DialogExport

      /* 具有进度条属性，且polling不是空对象，则自动开启轮询 */
      this.isProgress &&
        Object.keys(this.polling).length > 0 &&
        this.pollingProgress()
    },
    close() {
      this.component = null
    },
    pollingProgress() {
      /**
       * 定时器时间定为1s，意味着中间的 async request 必须在1s内给出响应，
       * 开发这个组件的时候我认为这个轮询接口是 "有问必秒答" 的 ：
       * （文件生成的进度，直接后端计算下当前分页拉取到了多少页再和 total 做个除法就能有响应的东西，理论上不会太久）
       * 1s 的时间刚好看起来对人的眼睛来说不长，对服务的响应来说不短，若后端接口计算量实在太大，请重新定义一次本组件
       * 有想过移除定时器任务，那么在秒答的接口中，并且这个接口的文件生成进度慢的情况下 则会发送成千上万请求，对服务器造成压力
       * */
      this.timer = setInterval(async() => {
        /**
         * res.data 一定得是直接可以使用的进度条数字，否则请参考 axios.request(config)
         * config.transformResponse 可以对响应进行 fit 处理
         * (必选参数：)
         * config.baseURL
         * config.url
         * config.method
         * (看似必须参数：)
         * config.params or config.data
         * config.headers
         * config.transformResponse
         * */

        await axios
          .request(this.polling)
          .then((res) => {
            /* 获取直接可用的数据 */
            this.progressValue = parseInt(res)

            if (this.progressValue === 100) {
              /* 进度完成，清除定时器 */
              clearInterval(this.timer)
              /* 进度完成 to download */
              this.download.start = true

              /* 进度完成，设置导出对话框不可见，真实的关闭靠 :is=null,已在watch中实现 */
              this.$emit('update:isVisible', false)
            } else {
              /* 未完成，及时清除上次的定时器，准备进入下一次迭代 */
              clearInterval(this.timer)
              /* 未完成，进入迭代 继续轮询 */
              this.pollingProgress()
            }
          })
          .catch(() => {
            /* 进度中途异常，清除定时器，准备退出 */
            clearInterval(this.timer)
            /* 进度中途异常，设置导出对话框不可见，真实的关闭靠 :is=null,已在watch中实现 */
            this.$emit('update:isVisible', false)
          })
      }, 1000)
    },

    async doRequestDownFile() {
      try {
        /* 接受四个参数 */
        const { baseURL, url, data, headers } = this.download || {}
        /**
         * method：约束一个 post 请求不是难事 （默认）
         * timeout：约束一个下载流的时间为永不超时，适应于特大文件下载的场景，预期结果是秒下，不应该会有超过10s的事情
         * responseType：约束下载的类型为 blob
         * */
        const res = await axios.request({
          baseURL,
          method: 'POST',
          url,
          timeout: 0,
          data,
          responseType: 'blob',
          headers,
          withCredentials: true
        })
        if (!res) {
          return
        }
        /**
         * 要求后端以流的方式下载，response headers 中要存在：
         * content-type: application/octet-stream
         * content-disposition: attachment;filename= xxx.xlsx
         * 注意后端返回的文件名有无乱码
         * 注意跨域时后端return 的时候要让后端 set responseHeader：
         * Access-Control-Expose-Headers: Content-Disposition
         */
        const contentDisposition =
          res.headers['Content-Disposition'] ||
          res.headers['content-disposition']
        const resFileNameStr = decodeURIComponent(contentDisposition) // 注意后端需要编码
        const index = resFileNameStr.indexOf('=')
        const downName =
          index !== -1
            ? resFileNameStr.slice(index + 1)
            : `${new Date().getTime()}.xlsx` // 文件名回退策略，注意，有时候为 csv

        /* 创造元素，创造宿主元素，合成事件触发下载 */
        const URL = window.URL.createObjectURL(new Blob([res]))
        const LINK = document.createElement('a')
        LINK.style.display = 'none'
        LINK.href = URL
        LINK.setAttribute('download', downName)
        document.body.appendChild(LINK)
        LINK.click()

        this.$emit('update:isVisible', false)
      } catch (e) {
        this.$message({
          type: 'error',
          message: '文件下载异常，请打开控制台查看详情！',
          showClose: true
        })
        this.$emit('update:isVisible', false)
        console.error(e)
      }
    }
  }
}
</script>
