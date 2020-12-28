<template>
  <el-input placeholder="请输入内容" v-model="content" clearable>
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
</template>
<script>
export default {
  name: 'Cus',
  props: {
    vModel: [String]
  },
  data() {
    return {
      content: ''
    }
  },
  watch: {
    content(newval) {
      /* 已在组件内部注入change方法，此组件只需emit，表单中就能接收到此自定义组件的值 */
      /* 自定义的组件，一定要有这一步，父子组件的通讯靠的就是 emit */
      this.$emit('change', newval)
    },
    vModel: {
      immediate: true,
      handler: function(newval) {
        this.content = newval
      }
    }
  }
}
</script>
