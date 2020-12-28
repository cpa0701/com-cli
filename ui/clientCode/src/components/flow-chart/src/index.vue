<template>
  <div class="he-flow-chart__content" ref="flowChart">
    <div class="he-fc__aside">
      <p class="he-fc__aside-title">工具栏</p>
      <FlowAside
        v-for="(item, index) in asideList"
        :key="index"
        :icon="item.icon"
        :name="item.name"
        @addNode="handleAddNode"
      />
    </div>
    <div id="he-workspace" class="he-workspace">
      <FlowNode
        v-for="item in data.nodeList"
        :key="item.id"
        :id="item.id"
        :node="item"
        @deleteNode="deleteNode"
        @changeNodeSite="changeNodeSite"
        @dblclickNode="clickNode"
      />
    </div>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import { flowChartMixin } from './mixin'
import FlowNode from './node'
import FlowAside from './aside'
export default {
  name: 'HeFlowChart',
  mixins: [flowChartMixin],
  components: {
    FlowNode,
    FlowAside
  },
  props: {
    nodeList: Object,
    asideList: Array
  },
  data() {
    return {
      jsPlumb: null,
      contentSite: {
        top: 0,
        left: 0
      },
      data: {
        nodeList: [],
        lineList: []
      }
    }
  },
  created() {
    this.data = this.nodeList
  },
  watch: {
    nodeList(newV) {
      this.data = newV
      this.$nextTick(() => {
        this.initJsPlumb()
      })
    }
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      this.getContentPosi()
      this.initJsPlumb()
    })
  },
  methods: {
    getContentPosi() {
      const el = this.$refs.flowChart
      this.contentSite = {
        top: el.getBoundingClientRect().top,
        left: 0
      }
    },
    initJsPlumb() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线,
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.$confirm('确定删除所点击的线吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.jsPlumb.deleteConnection(conn)
            })
            .catch(() => {})
        })
        // 连线
        this.jsPlumb.bind('connection', (evt) => {
          const from = evt.source.id
          const to = evt.target.id
          this.data.lineList.push({ from: from, to: to })
          this.updateData(this.data)
          this.$emit('connection', { from: from, to: to })
        })

        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
          this.$emit('deleteLine', evt.sourceId, evt.targetId)
        })

        // 连线
        this.jsPlumb.bind('beforeDrop', (evt) => {
          const from = evt.sourceId
          const to = evt.targetId
          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持两个节点之间连线回环')
            return false
          }
          this.$message.success('连接成功')
          return true
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
          console.log('beforeDetach', evt)
        })
      })
    },
    // 是否具有该线
    hasLine(from, to) {
      for (let i = 0; i < this.data.lineList.length; i++) {
        const line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (let i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(node.id, { containment: 'parent' })
      }
      // 初始化连线
      for (let i = 0; i < this.data.lineList.length; i++) {
        const line = this.data.lineList[i]
        this.jsPlumb.connect(
          { source: line.from, target: line.to },
          this.jsplumbConnectOptions
        )
      }
      this.$nextTick(function() {
        this.loadEasyFlowFinish = true
      })
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId) {
      this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.data.nodeList = this.data.nodeList.filter(function(node) {
            return node.id !== nodeId
          })

          this.updateData(this.data)
          this.$emit('deleteNode', nodeId)
          this.$nextTick(function() {
            this.jsPlumb.removeAllEndpoints(nodeId)
          })
        })
        .catch(() => {})
      return true
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }

      this.updateData(this.data)
    },
    clickNode(node) {
      this.$emit('dblClick', node)
    },
    handleAddNode(node) {
      this.getContentPosi()
      node.left = `${node.left - this.contentSite.left}px`
      node.top = `${node.top - this.contentSite.top}px`
      this.data.nodeList.push(node)
      this.updateData(this.data)
      this.$emit('addNode', node)
      this.$nextTick(function() {
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })
      })
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function(line) {
        if (line.from === from && line.to === to) {
          return false
        }
        return true
      })
      this.updateData(this.data)
    },
    updateData(data) {
      this.$emit('update:nodeList', data)
    }
  }
}
</script>

<style lang="scss">
@import "./index";
</style>
