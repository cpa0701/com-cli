<template>
  <he-page page-name="iframe-page">
    <he-iframe src="http://www.baidu.com"></he-iframe>
  </he-page>
</template>

<script>
import { HePage } from '../page/index'
import HeIframe from './src/index'

export default {
  components: {
    HePage,
    HeIframe
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
