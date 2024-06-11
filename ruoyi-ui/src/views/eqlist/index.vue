<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleOpen('新增')">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData">
      <el-table-column prop="position" label="位置" width="300"></el-table-column>
      <el-table-column prop="time" label="发震时间"></el-table-column>
      <el-table-column prop="magnitude" label="震级"></el-table-column>
      <el-table-column prop="longitude" label="经度"></el-table-column>
      <el-table-column prop="latitude" label="纬度"></el-table-column>
      <el-table-column prop="depth" label="深度"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleOpen('修改',scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="30%" :show-close="false">
      <el-row :gutter="10">
        <el-col :span="6">位置：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.position" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">发震时间：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.time" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">震级：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.magnitude" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">经度：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.longitude" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">纬度：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.latitude" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">深度：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.depth" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addEq, getAllEq, deleteeq, updataEq} from '@/api/system/eqlist'

export default {
  name: "index",
  data() {
    return {
      getEqData: [],
      tableData: [],
      total: 0,
      pageSize: 10,
      pageSizes: [5, 10, 20, 40],
      currentPage: 1,
      //--------------------------------------
      dialogShow: false,
      dialogTitle: null,
      dialogContent: {
        position: '',
        time: '',
        magnitude: '',
        longitude: '',
        latitude: '',
        depth: '',
        eqid: ''
      },
    }
  },
  mounted() {
    this.getEq()
  },
  methods: {
    getEq() {
      let that = this
      getAllEq().then(res => {
        that.getEqData = res
        that.total = res.length
        that.tableData = that.getPageArr()
      })
    },
    // 删除单条地震
    handleDelete(row) {
      let that = this
      deleteeq({eqid: row.eqid}).then(res => {
        that.getEq()
      })
    },
    // 点击新增或修改打开dialog对话框
    handleOpen(title, row) {
      if (title === "新增") {
        this.dialogTitle = title
      } else {
        this.dialogTitle = title
        this.dialogContent = {...row}
      }
      this.dialogShow = !this.dialogShow
    },
    // 确认提交修改或新增
    commit() {
      let that = this
      if (this.dialogTitle === "新增") {
        this.dialogContent.eqid = Date.now()
        addEq(this.dialogContent).then(res => {
          that.getEq()
          that.dialogShow = false
          this.clearDialogContent()
        })
      } else {
        updataEq(this.dialogContent).then(res=>{
          that.getEq()
          that.dialogShow = false
          this.clearDialogContent()
        })
      }
    },
    // 关闭dialog对话框
    cancel() {
      this.dialogShow = false
      this.clearDialogContent()
    },
    // 清除DialogContent中的数据
    clearDialogContent() {
      Object.keys(this.dialogContent).forEach(key => {
        this.dialogContent[key] = ''
      });
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

</style>
