<template>
  <el-input
    v-model.trim="currentVal"
    @change="onInput"
    @blur="onBlur"
    v-bind="$attrs"
    v-on="$listeners"
  >
  </el-input>
</template>

<script>
// todo clearable属性无法触发表单验证
export default {
  name: 'MoneyInput',
  components: {},
  props: {
    // ...Input.props,
    value: {
      default: ''
    },
    // 精度保留
    digits: {
      type: Number,
      default: 2
    },
    // 是否四舍五入
    rounding: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 精度修复基数
    digitsBase() {
      return 10 ** this.digits
    },
    // 默认格式化值
    defaultFormatVal() {
      let res = '0.'
      while (res.length < this.digits + 2) {
        res += '0'
      }
      return res
    }
  },
  data() {
    return {
      currentVal: ''
    }
  },
  mounted() {},
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentVal = this.autoDecimal(val)
      }
    }
  },
  methods: {
    // 自动精度
    autoDecimal(val) {
      return this.rounding ? this.autoToFixed(val) : this.changeDecimal(val)
    },
    /**
     * 四舍五入保留精度x位,自动补0
     * 返回字符串类型
     * */
    autoToFixed(value) {
      if (Number.isNaN(value)) {
        return ''
      }
      const val = value * 1 // 数据类型隐性转换
      return val ? val.toFixed(this.digits) : this.defaultFormatVal
    },
    /**
     * 将number保留bitNum位小数，不够补0,超出位数会自动舍弃
     * @param number
     * @returns {string|number}
     */
    changeDecimal(number) {
      const bitNum = this.digits
      const f = parseFloat(number)
      if (Number.isNaN(f)) {
        return 0
      }
      let s = number.toString()
      let pos_decimal = s.indexOf('.')
      // 没有小数点的加上小数点
      if (pos_decimal < 0) {
        pos_decimal = s.length
        if (bitNum !== 0) {
          s += '.'
        } else {
          // 没有小数点还要保留0位小数
          return s
        }
      }
      if (s.length <= pos_decimal + bitNum) {
        while (s.length <= pos_decimal + bitNum) {
          s += '0'
        }
      } else {
        s = s.substring(0, pos_decimal + bitNum + 1)
      }
      return s
    },
    onInput(val) {
      const inputVal = this.autoDecimal(val)
      this.currentVal = inputVal
      this.$emit('change', inputVal)
    },
    onBlur($event) {
      console.warn('==1onBlur1===', $event.target.value)
      this.$emit('update:value', $event.target.value) // 实现 sync效果
      // this.$emit('blur', $event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped></style>
