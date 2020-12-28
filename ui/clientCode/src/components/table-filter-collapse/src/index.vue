<template>
  <div :class="[classes('table-filter-collapse'), className]">
    <el-collapse
      v-model="activeCollapse"
      @change="onCollapseChange"
      v-if="isCollapse"
    >
      <el-collapse-item title="搜索条件" name="filter">
        <slot />
      </el-collapse-item>
    </el-collapse>

    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'

export default {
  name: 'HeTableFilterCollapse',
  components: {},
  mixins: [classesMixin()],
  props: {
    className: {
      type: String,
      default: ''
    },
    // 开启折叠搜索条件
    isCollapse: {
      type: Boolean,
      default: true
    },
    // 当前展开状态
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeCollapse: [] // 'filter'
    }
  },
  computed: {},
  created() {
    this.activeCollapse = this.isActive ? ['filter'] : []
  },
  mounted() {},
  methods: {
    onCollapseChange() {
      this.$emit(
        'collapse',
        this.activeCollapse && this.activeCollapse.length > 0
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index";
</style>
