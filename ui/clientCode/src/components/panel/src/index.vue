<template>
  <div :class="[classes('panel')]">
    <div :class="[classes('panel-bar')]">
      <span :class="[classes('panel-left')]">
        <slot name="bar-left">
          <span :class="[classes('panel-title')]">{{ title }}</span>
        </slot>
      </span>
      <span :class="[classes('panel-right')]">
        <slot name="bar-right"></slot>
      </span>
    </div>
    <div :class="[classes('panel-body')]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HePanel',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  mixins: [classesMixin()],
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
