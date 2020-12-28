<template>
  <div :class="[classes('table-filter'), className]">
    <el-form
      :class="[classes('table-filter-form')]"
      :inline="true"
      :model="model"
      :rules="rules"
      :label-width="labelWidth"
      size="mini"
      ref="dataFilterForm"
      @submit.native.prevent
    >
      <div :class="[classes('table-filter-slot')]">
        <el-row :gutter="10" class="table-filter-row">
          <slot></slot>
          <el-form-item label="" class="g-filter-col-item" label-width="82px">
            <!--查询重置-->
            <slot name="filterSubmit">
              <div :class="[classes('table-filter-submit-group')]">
                <el-button
                  type="primary"
                  native-type="submit"
                  @click.stop.prevent="handleSubmit"
                  @keyup.enter.native="handleSubmit"
                  :disabled="model.submitting"
                >
                  {{ model.submitting ? "正在查询..." : "查询" }}
                </el-button>
                <el-button
type="info"
@click.stop.prevent="handleReset"
                  >重置</el-button
                >
                <el-button
                  v-if="toggleMore"
                  plain
                  @click.stop.prevent="handleToggleMore"
                >
                  {{ moreButtonText }}
                  <i
                    :class="[
                      showMore ? 'el-icon-arrow-left' : 'el-icon-arrow-right',
                    ]"
                  ></i>
                </el-button>
              </div>
            </slot>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'

export default {
  name: 'HeTableFilter',
  components: {},
  mixins: [classesMixin()],
  props: {
    className: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: '120'
    },
    // 是否显示切换更多按钮
    toggleMore: {
      type: Boolean,
      default: false
    },
    // 验证规则
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    // 字段模型
    model: {
      type: Object,
      default() {
        return {
          submitting: false
        }
      }
    },
    // 开启折叠搜索条件
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMore: false,
      activeCollapse: ['filter']
    }
  },
  computed: {
    moreButtonText() {
      return this.showMore ? '收缩' : '展开'
    }
  },
  mounted() {},
  methods: {
    handleSubmit() {
      this.$emit('submit', this.model, this.rules)
    },
    handleReset() {
      this.$refs['dataFilterForm'].resetFields()
      this.$emit('reset', this.model, this.rules)
    },
    handleToggleMore() {
      this.showMore = !this.showMore
      // this.$emit('toggleMore',this.model,this.rules);
    },
    onCollapseChange() {
      this.$emit('collapse', this.model, this.rules)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index";
</style>
