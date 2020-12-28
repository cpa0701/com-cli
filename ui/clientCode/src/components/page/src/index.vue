<template>
  <div :class="[classes('page'), classes(`${pageName}`)]">
    <slot></slot>
  </div>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HePage',
  components: {},
  props: {
    pageName: {
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
