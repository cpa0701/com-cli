<template>
  <el-form-item label=" " class="mixin-button">
    <el-button type="primary" @click="handleQueryAction">查询</el-button>
    <el-button @click="handleResetForm">重置</el-button>
    <el-button @click="handleClearForm">清空</el-button>
    <el-link
      v-if="len > 2"
      type="primary"
      style="margin-left:10px;"
      @click="handleCollapseStatus"
      class="expand-btn"
    >
      展开全部
      <i
        class="el-icon-caret-right"
        :class="{
          'arrow-direction': isShowExtFilter,
          'arrow-direction-default': true
        }"
      ></i>
    </el-link>
  </el-form-item>
</template>

<script>
export default {
  name: 'FilterButton',
  props: {
    isShowExtFilter: {
      required: true,
      type: Boolean
    },
    len: {
      required: true,
      type: Number
    }
  },
  data() {
    return {}
  },
  methods: {
    handleQueryAction() {
      this.$emit('query')
    },
    handleResetForm() {
      this.$emit('reset')
    },
    handleClearForm() {
      this.$emit('clear')
    },
    handleCollapseStatus() {
      this.$emit('expand')
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-form-item__content {
  display: flex !important;
  flex-wrap: no-wrap;
  justify-content: center;
  align-items: center;
}
.expand-btn {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
