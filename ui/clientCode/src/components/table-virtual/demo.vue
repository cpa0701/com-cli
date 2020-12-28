<template>
  <HeTableVirtual
    :data="tableData"
    style="width: 100%;"
    :use-virtual="true"
    :use-virtual-column="true"
    :height="600"
    row-key="rowKey"
    key="tableKey"
    border
    fit
    highlight-current-row
  >
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  </HeTableVirtual>
</template>

<script>
import { HeTableVirtual } from './index'
export default {
  components: {
    HeTableVirtual
  },
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.myriadData()
  },
  methods: {
    myriadData() {
      const arr = []
      for (let i = 0; i < 10000; i++) {
        const obj = {
          date: '2016-05-04',
          name: '王小虎',
          address: `上海市普陀区金沙江路 ${i} 弄`
        }
        arr.push(obj)
      }
      this.tableData = arr
    }
  }
}
</script>

<style lang="scss" scoped></style>
