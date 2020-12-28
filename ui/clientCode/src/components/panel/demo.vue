<template>
  <div class="demo-panel-list">
    <ul>
      <li>
        <he-panel title="快捷导航">
          <p>快捷导航</p>
        </he-panel>
      </li>
      <li>
        <he-panel title="版本信息">
          <div slot="bar-right">
            <he-iconfont icon-class="el-icon-more" />
          </div>
          <p>版本信息</p>
        </he-panel>
      </li>
      <li>
        <he-panel>
          <div slot="bar-left">
            <el-tabs v-model="tabsActiveName" @tab-click="handleTabClick">
              <el-tab-pane label="数据预览" name="previewData"></el-tab-pane>
              <el-tab-pane label="消息中心" name="message"></el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="tabsActiveName === 'previewData'">
            <p>数据预览</p>
          </div>
          <div v-if="tabsActiveName === 'message'">
            <p>消息中心</p>
          </div>
        </he-panel>
      </li>
      <li>
        <he-panel title="订单统计">
          <div slot="bar-right">
            <he-iconfont icon-class="el-icon-s-order" />
          </div>
          <p>订单统计</p>
        </he-panel>
      </li>
    </ul>
  </div>
</template>

<script>
import HePanel from './src/index'
import { HeIconfont } from '../iconfont'

export default {
  name: 'Demo',
  components: {
    HePanel,
    HeIconfont
  },
  props: {},
  data() {
    return {
      tabsActiveName: 'previewData'
    }
  },
  methods: {
    handleTabClick(item) {
      console.log('===handleTabClick====', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-panel-list {
  height: 800px;
  background: #e7eaec;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul {
    display: flex;
    justify-items: center;
    flex-wrap: wrap;
  }

  ul li {
    width: 45%;
    margin: 10px;
  }

  /deep/ {
    // tabs 重置
    .el-tabs__nav-wrap::after {
      background: none;
    }
  }
}
</style>
