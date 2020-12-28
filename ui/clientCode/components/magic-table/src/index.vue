<template>
    <div>
        <el-table
            :data="data"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <el-table-column v-for="(item, index) in column" :key="index" :prop="item.prop" :label="item.label"/>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'z-magic-table',
    props: {
        column: {
            type: Array,
            require: true
        },
        data: {
            type: Array,
            require: true
        }
    },
    methods: {
    }
}
</script>

<style lang="scss">
</style>