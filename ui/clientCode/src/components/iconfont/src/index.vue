<template>
  <span
    v-if="isExternal"
    :style="styleExternalIcon"
    :class="[classes('external-icon'), classes('icon')]"
    v-on="$listeners"
  ></span>
  <span v-else :class="iconClass" v-on="$listeners"></span>
</template>

<script>
import { classesMixin } from '../../../common/mixins/classname'
export default {
  name: 'HeIconfont',
  components: {},
  props: {
    iconClass: {
      type: String,
      required: true
    }
  },
  mixins: [classesMixin()],
  computed: {
    isExternal() {
      return /^(https?:|mailto:|tel:)/.test(this.iconClass)
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index";
</style>
