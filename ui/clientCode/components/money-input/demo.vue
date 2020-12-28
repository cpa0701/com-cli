<template>
  <div class="money-input-page">
    <money-input
      :value.sync="price"
      @blur="onBlur"
      @change="onChange"
    />
  </div>
</template>

<script>
import moneyInput from './index'
export default {
  components: {
    moneyInput
  },
  data() {
    return {
      price: 100.006
    }
  },
  mounted() {},
  methods: {
    onChange(val) {
      console.log('===onChange====', val)
    },
    onBlur(val) {
      console.log('===onBlur1====', val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .money-input-page{
    padding: 10px;
  }
</style>
