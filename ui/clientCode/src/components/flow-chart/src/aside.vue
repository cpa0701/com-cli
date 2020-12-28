<template>
  <draggable @end="end">
    <div class="he-fc__aside-item" :asideIcon="icon" :asideName="name">
      <i :class="iconClass"></i>
      <span class="he-fc__ai-text">{{ name }}</span>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'HeFcAside',
  components: {
    draggable
  },
  props: {
    icon: String,
    name: String
  },
  data() {
    return {}
  },
  computed: {
    iconClass() {
      const iclass = {}
      iclass[this.icon] = true
      iclass['he-fc__ai-icon'] = true
      return iclass
    }
  },
  methods: {
    getUUID() {
      return Math.random().toString(36).substr(3, 10)
    },
    end(event) {
      const node = {}
      node.icon = event.item.attributes.asideIcon.nodeValue
      node.name = event.item.attributes.asideName.nodeValue
      node.id = this.getUUID()
      node.left = event.originalEvent.layerX - 170
      node.top = event.originalEvent.clientY - 20
      this.$emit('addNode', node)
    }
  }
}
</script>

<style>
.he-fc__aside-item {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  cursor: move;
}

.he-fc__aside-item:hover {
  background: #f0f7ff;
}

.he-fc__ai-icon {
  height: 30px;
  font-size: 28px;
  text-align: center;
}

.he-fc__ai-text {
  text-align: center;
}
</style>
