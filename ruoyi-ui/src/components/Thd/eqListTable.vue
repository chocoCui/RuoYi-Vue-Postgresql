<template>
  <div class="eqtable">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 5px"
      :stripe="true"
      :header-cell-style="tableHeaderColor"
      :cell-style="tableColor"
      @row-click="plotAdj"
    >
      <el-table-column
        prop="position"
        label="位置">
      </el-table-column>
      <el-table-column
        prop="time"
        label="发震时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="magnitude"
        label="震级"
        width="50">
      </el-table-column>
      <el-table-column
        prop="longitude"
        label="经度"
        width="65">
      </el-table-column>
      <el-table-column
        prop="latitude"
        label="纬度"
        width="65">
      </el-table-column>
      <el-table-column
        prop="depth"
        label="深度"
        width="50">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "eqListTable",
  data() {
    return {
      total: 0,
      pageSize: 6,
      currentPage: 1,
      getEqData:[],
      tableData: [],

    }
  },
  props:['eqData'],
  watch:{
    eqData(){
      this.getEqData = this.eqData
      this.total = this.eqData.length
      this.tableData = this.getPageArr()
    }
  },
  methods:{
    plotAdj(row){
      this.$emit('plotAdj',row)
    },
    tableHeaderColor(){
      return 'border-color:#313a44;background-color: #313a44;color: #fff;padding: 0;text-align:center'
    },
    // 修改table header的背景色
    tableColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex%2==1) {
        return 'border-color:#313a44;background-color: #313a44;color: #fff;padding: 0;text-align:center'
      }else{
        return 'border-color:#304156;background-color: #304156;color:#fff;padding: 0;text-align:center'
      }
    },
    // 对数据库获取到的标绘图片数组切片
    getPageArr() {
      let arr = []
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      if (end > this.total) {
        end = this.total
      }
      for (; start < end; start++) {
        arr.push(this.getEqData[start])
      }
      return arr
    },
    //`每页 ${val} 条`
    handleSizeChange(val) {
      this.pageSize = val
      this.tableData = this.getPageArr()
      // console.log(`每页 ${val} 条`);
    },
    // `当前页: ${val}`
    handleCurrentChange(val) {
      this.currentPage = val
      this.tableData = this.getPageArr()
      // console.log(`当前页: ${val}`);
    },
  }
}
</script>

<style scoped>
.eqtable{
  text-align: center;
  /*height: calc(30vh - 35px);*/
  border-radius: 10px;
  background: rgba(57,55,53,80%);
  margin-left: 10px;
  padding: 10px;
  width: 500px;
}
.el-table::before, .el-table--group::after, .el-table--border::after{
  background-color: #304156!important;
}
</style>
