<template>
  <div :class="[classes('table-control')]">
    <div :class="[classes('table-control-left')]">
      <el-button-group v-if="groupButton && groupButton.length">
        <el-button
          type="primary"
          :icon="item.icon"
          size="mini"
          class="x-table-control-item"
          v-for="item in groupButton"
          :key="item.key"
          :disabled="item.disable"
          @click="handleButton(item)"
        >
          {{ item.name }}
        </el-button>
      </el-button-group>

      <el-dropdown
        size="mini"
        split-button
        type="primary"
        :class="classes('table-control-more-menu')"
        @command="handleCommand"
        v-if="groupDropdown && groupDropdown.length"
      >
        <span>更多</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in groupDropdown"
            :key="index"
            :command="item.val"
            :disabled="item.disable"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div :class="[classes('table-control-right')]">
      <div :class="[classes('table-control-pagination')]">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page.num"
          :page-size.sync="page.size"
          :total.sync="page.total"
          :page-sizes="pageSizes"
          :layout="layout"
        >
        </el-pagination>
      </div>
      <div :class="[classes('table-control-normal')]">
        <el-button
          type="info"
          icon="el-icon-refresh"
          size="mini"
          :class="classes('table-control-item')"
          @click="handleRefresh"
        >
        </el-button>

        <el-dropdown
          size="mini"
          split-button
          type="primary"
          :hide-on-click="false"
          @command="handleFilterCommand"
          trigger="click"
          :class="classes('table-control-more-menu')"
          v-if="isFilter"
        >
          <span>筛选</span>
          <el-dropdown-menu slot="dropdown">
            <slot name="filterDropdown">
              <el-dropdown-item
                v-for="(item, index) in groupFilterDropDown"
                :key="index"
                :command="item.val"
                :disabled="item.disable"
              >
                <el-checkbox
                  :label="item.name"
                  :disabled="item.disable"
                  @change="changeCheckBox($event, item)"
                ></el-checkbox>
              </el-dropdown-item>
            </slot>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HeTableControl',
  components: {},
  mixins: [classesMixin()],
  props: {
    // 操作按钮组
    groupButton: {
      type: Array,
      default: function() {
        return [
          // {
          //   name:'添加',
          //   icon:'el-icon-plus',
          //   key:'add',
          //   disable:false
          // },
          // {
          //   name:'编辑',
          //   icon:'el-icon-edit',
          //   key:'edit',
          //   disable:false
          // },
          // {
          //   name:'删除',
          //   icon:'el-icon-delete',
          //   key:'delete',
          //   disable:false
          // },
          // {
          //   name:'导入',
          //   icon:'el-icon-upload2',
          //   key:'imports',
          //   disable:false
          // },
          // {
          //   name:'导出',
          //   icon:'el-icon-download',
          //   key:'exports',
          //   disable:false
          // }
        ]
      }
    },
    // 下拉选项组
    groupDropdown: {
      type: Array,
      default: function() {
        return [
          // {
          //   name:'黄金糕',
          //   val:'a',
          //   disabled:false
          // },
          // {
          //   name:'狮子头',
          //   val:'b',
          //   disabled:false
          // },
          // {
          //   name:'螺蛳粉',
          //   val:'c',
          //   disabled:false
          // }
        ]
      }
    },
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
      default: 'prev, pager, next'
    },
    // 筛选按钮组
    isFilter: {
      type: Boolean,
      default: true
    },
    groupFilterDropDown: {
      type: Array,
      default: function() {
        return [
          // {
          //   name:'复选框 A',
          //   val:'a',
          //   disabled:false
          // },
          // {
          //   name:'复选框 B',
          //   val:'b',
          //   disabled:false
          // },
          // {
          //   name:'复选框 C',
          //   val:'c',
          //   disabled:false
          // }
        ]
      }
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleButton(item) {
      this.$emit('onButton', item)
    },
    handleCommand(command) {
      this.$emit('onDropdown', command)
    },
    handleRefresh() {
      this.$emit('onRefresh')
    },
    // 筛选下拉
    handleFilterCommand(command) {
      this.$emit('onFilterDropdown', command)
    },
    changeCheckBox(val, item) {
      this.$emit('changeFilterItem', val, item)
    },
    // 分页
    handleSizeChange(size) {
      this.page.num = 1
      this.page.size = size
      this.$emit('sizeChange', size)
    },
    handleCurrentChange(num) {
      this.page.num = num
      this.$emit('currentChange', num)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index";
</style>
