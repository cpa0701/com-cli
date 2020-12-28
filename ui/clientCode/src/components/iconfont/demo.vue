<template>
  <he-page page-name="icons-page">
    <el-tabs type="border-card">
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item">
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateElementIconCode(item) }}
              </div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span class="text">{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="he-Icons">
        <div class="grid">
          <div v-for="item of heIcons" :key="item">
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateIconCode(item) }}
              </div>
              <div class="icon-item">
                <he-iconfont :icon-class="'he-icon-' + item" class="disabled" />
                <span class="text">{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </he-page>
</template>

<script>
import HeIconfont from './src/index'
import { HePage } from '../page/index'
import elIcons from './el-icons'
import heIcons from './he-icons'

export default {
  components: {
    HeIconfont,
    HePage
  },
  data() {
    return {
      elementIcons: elIcons,
      heIcons
    }
  },
  computed: {},
  mounted() {},
  methods: {
    generateIconCode(symbol) {
      return `<he-iconfont icon-class="he-icon-${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/common";
.#{$prefix}-icons-page {
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span.text {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
