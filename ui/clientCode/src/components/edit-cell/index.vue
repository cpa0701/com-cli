<template>
  <div class="edit-cell">
    <component
      class="edit-cell-input"
      :size="size"
      :is="editableComponent"
      v-if="editMode || showInput"
      ref="input"
      @keyup.enter.native="onInputExit"
      v-on="listeners"
      v-bind="$attrs"
      v-model="model"
    >
      <slot name="edit-component-slot"></slot>
    </component>
    <div
      tabindex="0"
      class="cell-content"
      :class="{ 'edit-enabled-cell': canEdit }"
      @keyup.enter="onFieldClick"
      @click="onFieldClick"
      v-else
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeEditCell',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    showInput: {
      type: Boolean,
      default: false
    },
    editableComponent: {
      type: String,
      default: 'el-input'
    },
    closeEvent: {
      type: String,
      default: 'blur'
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      editMode: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    listeners() {
      return {
        [this.closeEvent]: this.onInputExit,
        ...this.$listeners
      }
    }
  },
  methods: {
    onFieldClick() {
      if (this.canEdit) {
        this.editMode = true
        this.$nextTick(() => {
          const inputRef = this.$refs.input
          if (inputRef && inputRef.focus) {
            inputRef.focus()
          }
        })
      }
    },
    onInputExit() {
      this.editMode = false
    },
    onInputChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
