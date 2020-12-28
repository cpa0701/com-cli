<template>
    <div>
        <h-button type="default">默认按钮123124</h-button>
    </div>
</template>

<script>
import hButton from './index.vue'
export default {
    name: "button-demo",
    data() {
        return {
            type: 'primary'
        }
    },
    components: {
        hButton
    },
    methods: {
    }
}
</script>