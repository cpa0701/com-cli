<template>
  <el-dialog
    width="300px"
    center
    :title="title"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :before-close="handleBeforeClose"
  >
    <div v-if="!isProgress">
      <!-- turn around animation 模式-->
      <div class="turn-around" v-loading="false">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
        <span>正在导出,请勿重复提交 . . .</span>
      </div>
    </div>
    <div v-else>
      <!-- progress animation 模式-->
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="progressValue"
        status="success"
      ></el-progress>
    </div>
    <span slot="footer" class="dialog-footer" v-if="false">
      <el-button
@click="centerDialogVisible = false"
size="mini"
        >取 消</el-button
      >
      <el-button
type="primary"
@click="centerDialogVisible = false"
size="mini"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogExport',
  props: {
    title: {
      required: false,
      default: '正在导出,请勿重复提交或关闭 ...',
      type: [String]
    },
    isVisible: {
      required: false,
      default: false,
      type: [Boolean]
    },
    isProgress: {
      required: false,
      default: true,
      type: [Boolean]
    },
    progressValue: {
      required: false,
      default: 0,
      type: [Number]
    }
  },
  watch: {
    progressValue(newVal) {
      if (newVal === 100) {
        console.log('change')
        this.completed()
      }
    }
  },
  methods: {
    completed() {
      /* 自我毁灭 */
      this.$emit('update:isVisible', false)
      this.$emit('update:title', '')
      this.$emit('update:isProgress', false)
      this.$emit('update:progressValue', 0)
    },
    handleBeforeClose(done) {
      console.log('关闭')
      this.$emit('update:isVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog__wrapper {
  background: rgba(0, 0, 0, 0.6) !important;
}
::v-deep .el-dialog__header {
  text-align: left;
}
::v-deep .el-dialog__header .el-dialog__title {
  font-size: 14.4px;
  color: #999999;
  font-weight: bold;
}

.turn-around {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  span:not(.little) {
    margin-left: 32px;
  }

  .little {
    margin: 0 2px;
  }

  .circular {
    height: 42px;
    width: 42px;
    animation: turn 2s linear infinite;
  }

  .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #1890ff;
    stroke-linecap: round;
  }
  @keyframes turn {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px;
    }
  }
}
</style>
