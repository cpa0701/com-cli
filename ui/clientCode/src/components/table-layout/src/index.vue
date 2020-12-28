<template>
  <div :class="[classes('table-layout')]">
    <div :class="[classes('table-top')]" v-if="title">
      <div :class="[classes('table-top-title')]">
        {{ title }}
      </div>
    </div>
    <div :class="[classes('table-hd')]">
      <slot name="header"></slot>
    </div>
    <div :class="[classes('table-bd')]">
      <slot></slot>
    </div>
    <div :class="[classes('table-ft')]">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HeTableLayout',
  components: {},
  mixins: [classesMixin()],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "index";
</style>
