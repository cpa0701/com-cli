<template>
  <div>
    <el-date-picker
      v-bind="$attrs"
      v-model="time"
      :startTime="startTime"
      :endTime="endTime"
      @change="change"
      @blur="blur"
      @focus="focus"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'DateTimeRange',
  props: {
    // datetimerange daterange
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      time: []
    }
  },
  inheritAttrs: false,
  computed: {},
  watch: {
    time(newVal, val) {
      this.time = Array.isArray(newVal) ? newVal : ['', '']
      this.$emit('update:startTime', this.time[0])
      this.$emit('update:endTime', this.time[1])
    },
    startTime(newVal, val) {
      this.time[0] = newVal
    },
    endTime(newVal, val) {
      this.$set(this.time, 1, newVal)
    }
  },
  mounted() {
    this.time = [this.startTime, this.endTime]
  },
  methods: {
    change(val) {
      const temp = Array.isArray(val) ? val : ['', '']
      this.$emit('change', temp[0], temp[1])
    },
    blur(val) {
      const temp = Array.isArray(val) ? val : ['', '']
      this.$emit('blur', this.time[0], temp[1])
    },
    focus(val) {
      const temp = Array.isArray(val) ? val : ['', '']
      this.$emit('focus', temp[0], temp[1])
    }
  }
}
</script>
<style lang="scss">
@import "./index.scss";
</style>
