<template>
  <div :class="[classes('iframe')]">
    <iframe
      :src="src"
      :style="{ width: width, height: height }"
      ref="iframe"
      @load="iframeLoad"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HeIframe',
  components: {},
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100vh'
    }
  },
  mixins: [classesMixin()],
  data() {
    return {
      iframeWin: null,
      isLoaded: false
    }
  },
  computed: {},
  mounted() {
    // 这里就拿到了iframe的对象
    // console.log(this.$refs.iframe);
    // 这里就拿到了iframe的window对象
    // console.log(this.$refs.iframe.contentWindow);
    this.iframeWin = this.$refs.iframe.contentWindow
  },
  methods: {
    iframeLoad() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      this.$emit('load')
    },
    // 非css3 设置iframe高度
    changeFrameHeight() {
      this.$refs.iframe.height = document.documentElement.clientHeight
      window.onresize = () => {
        this.$refs.iframe.height = document.documentElement.clientHeight
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
