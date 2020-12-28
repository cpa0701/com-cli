<template>
  <div :class="[classes('table-pagination')]">
    <el-pagination
      background
      :page-sizes="pageSizes"
      :current-page.sync="page.num"
      :page-size.sync="page.size"
      :total.sync="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :layout="layout"
    >
      <slot></slot>
    </el-pagination>
    <i
      class="el-icon-refresh"
      :class="classes('table-control-refresh')"
      @click="handleRefresh"
    >
    </i>
    <slot name="extend"></slot>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HeTablePagination',
  components: {},
  mixins: [classesMixin()],
  props: {
    // 分页配置
    pageSizes: {
      type: Array,
      default: function() {
        return [5, 10, 15, 20, 50, 100]
      }
    },
    page: {
      type: Object,
      default: function() {
        return {
          num: 1,
          size: 20,
          total: 0
        }
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    // 分页
    handleSizeChange(size) {
      this.$emit('sizeChange', size)
    },
    handleCurrentChange(num) {
      this.$emit('currentChange', num)
    },
    handleRefresh() {
      this.$emit('onRefresh')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index";
</style>
