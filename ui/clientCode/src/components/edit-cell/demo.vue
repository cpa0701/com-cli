<template>
  <div>
    <el-table
      class="edit-table-demo"
      :data="tableData"
      border
      size="mini"
      style="width: 100%;"
    >
      <el-table-column prop="name" label="日期" width="180">
        <editCell
          slot-scope="scope"
          :can-edit="true"
          v-model="scope.row.name"
          size="mini"
        >
          <template slot="content">{{ scope.row.name }}</template>
        </editCell>
      </el-table-column>
      <el-table-column prop="date" label="姓名" width="180">
        <editCell
          slot-scope="scope"
          :can-edit="true"
          v-model="scope.row.date"
          size="mini"
          type="datetime"
          editableComponent="el-date-picker"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
          <template slot="content">{{ scope.row.date }}</template>
        </editCell>
      </el-table-column>
      <el-table-column prop="address" label="地址">
        <editCell
          slot-scope="scope"
          :can-edit="true"
          v-model="scope.row.address"
          size="mini"
          type="datetime"
          editableComponent="el-select"
          closeEvent="change"
        >
          <template slot="edit-component-slot">
            <el-option
              lable="上海市普陀区金沙江路 1518 弄"
              value="上海市普陀区金沙江路 1518 弄"
            />
            <el-option
              lable="上海市普陀区金沙江路 1517 弄"
              value="上海市普陀区金沙江路 1517 弄"
            />
            <el-option
              lable="上海市普陀区金沙江路 1519 弄"
              value="上海市普陀区金沙江路 1519 弄"
            />
            <el-option
              lable="上海市普陀区金沙江路 1516 弄"
              value="上海市普陀区金沙江路 1516 弄"
            />
            <el-option
              lable="上海市普陀区金沙江路 1580 弄"
              value="上海市普陀区金沙江路 1580 弄"
            />
          </template>
          <template slot="content">{{ scope.row.address }}</template>
        </editCell>
      </el-table-column>
      <el-table-column prop="name" label="进度">
        <editCell
          slot-scope="scope"
          :can-edit="true"
          v-model="scope.row.pro"
          editableComponent="el-rate"
          size="mini"
          showInput
        >
          <template slot="content">{{ scope.row.pro }}</template>
        </editCell>
      </el-table-column>
      <el-table-column prop="age" label="年龄">
        <editCell
          slot-scope="scope"
          :can-edit="true"
          v-model="scope.row.age"
          editableComponent="el-input-number"
          size="mini"
          controls-position="right"
          closeEvent="change"
        >
          <template slot="content">{{ scope.row.age }}</template>
        </editCell>
      </el-table-column>
    </el-table>
    <el-button @click="handleClick">打印表格数据</el-button>
  </div>
</template>

<script>
import editCell from './index.vue'
export default {
  components: {
    editCell
  },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02 12:21:34',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          pro: 3,
          age: 15
        },
        {
          date: '2016-05-04 12:21:34',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          pro: 2,
          age: 15
        },
        {
          date: '2016-05-01 12:21:34',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          pro: 1,
          age: 15
        },
        {
          date: '2016-05-03 12:21:34',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          pro: 4,
          age: 15
        }
      ]
    }
  },
  methods: {
    handleClick() {
      console.log(this.tableData)
    }
  }
}
</script>
<style>
.edit-table-demo.el-table--mini td,
.edit-table-demo.el-table--mini th {
  padding: 0;
}

.edit-table-demo.el-table .cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
  height: 28px;
  line-height: 28px;
}
</style>
