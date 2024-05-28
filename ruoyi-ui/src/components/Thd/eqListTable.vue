<template>
  <div class="eqtable">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 5px"
      :stripe="true"
      :header-cell-style="tableHeaderColor"
      :cell-style="tableColor"
      @row-click="go"
    >
      <el-table-column
        prop="position"
        label="位置"
        width="100">
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
      >
      </el-table-column>
    </el-table>
    <el-pagination
      background
      small
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "eqListTable",
  data() {
    return {
      tableData: [
        {
          position:'四川德阳市绵竹市',
          time:'2024-05-15 08:49:10',
          magnitude:'3.0',
          longitude:'104.05',
          latitude:'31.55',
          depth:'13',
          eqId:'ckw123'
        },
        {
          position:'四川德阳市绵竹市',
          time:'2024-05-15 08:49:10',
          magnitude:'3.0',
          longitude:'104.05',
          latitude:'31.55',
          depth:'13'
        },
        {
          position:'四川德阳市绵竹市',
          time:'2024-05-15 08:49:10',
          magnitude:'3.0',
          longitude:'104.05',
          latitude:'31.55',
          depth:'13'
        },
        {
          position:'四川德阳市绵竹市',
          time:'2024-05-15 08:49:10',
          magnitude:'3.0',
          longitude:'104.05',
          latitude:'31.55',
          depth:'13'
        },
        {
          position:'四川德阳市绵竹市',
          time:'2024-05-15 08:49:10',
          magnitude:'3.0',
          longitude:'104.05',
          latitude:'31.55',
          depth:'13'
        },
        {
          position:'四川德阳市绵竹市',
          time:'2024-05-15 08:49:10',
          magnitude:'3.0',
          longitude:'104.05',
          latitude:'31.55',
          depth:'13'
        },
        // {
        //   position:'四川德阳市绵竹市',
        //   time:'2024-05-15 08:49:10',
        //   magnitude:'3.0',
        //   longitude:'104.05',
        //   latitude:'31.55',
        //   depth:'13'
        // },
        // {
        //   position:'四川德阳市绵竹市',
        //   time:'2024-05-15 08:49:10',
        //   magnitude:'3.0',
        //   longitude:'104.05',
        //   latitude:'31.55',
        //   depth:'13'
        // },
        // {
        //   position:'四川德阳市绵竹市',
        //   time:'2024-05-15 08:49:10',
        //   magnitude:'3.0',
        //   longitude:'104.05',
        //   latitude:'31.55',
        //   depth:'13'
        // },
        // {
        //   position:'四川德阳市绵竹市',
        //   time:'2024-05-15 08:49:10',
        //   magnitude:'3.0',
        //   longitude:'104.05',
        //   latitude:'31.55',
        //   depth:'13'
        // },
      ]
    }
  },
  methods:{
    go(row, column, cell, event){
      let route = this.$router.resolve({path: '/thd'}).href
      // window.open(route, '_blank');
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
}
.el-table::before, .el-table--group::after, .el-table--border::after{
  background-color: #304156!important;
}
</style>
