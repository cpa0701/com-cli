<template>
  <div>
    <el-dialog
      :append-to-body="true"
      title="dialog.title"
      :visible="visible"
      width="60%"
      :close-on-click-modal="false"
    >
      <heFlowChart
        :nodeList.sync="node"
        :asideList="aside"
        @dblClick="handleDblClick"
      />
    </el-dialog>
    <el-button @click="handleDialog">打开弹窗</el-button>

    <!-- <heFlowChart
                v-if="node.nodeList"
                :nodeList.sync="node"
                :asideList="aside"
                @dblClick="handleDblClick"
            /> -->
  </div>
</template>

<script>
import { heFlowChart } from './index.js'
import { nodeMcok, asideList } from './mock'
export default {
  name: 'FlowChartDemo',
  data() {
    return {
      node: {},
      aside: [],
      visible: false
    }
  },
  components: {
    heFlowChart
  },
  mounted() {
    setTimeout(() => {
      this.node = nodeMcok
      this.aside = asideList
    }, 1000)
  },
  methods: {
    handleDblClick(node) {
      console.log('双击', this.node)
    },
    handleDialog() {
      this.visible = true
    }
  }
}
</script>
