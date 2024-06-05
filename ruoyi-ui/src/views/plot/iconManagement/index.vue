<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleOpen('新增')">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData">
      <el-table-column prop="type" label="类型" width="180" align="center"></el-table-column>
      <el-table-column prop="img" label="符号" width="150" align="center">
        <template slot-scope="scope">
          <img width="50px" height="50px" :src="scope.row.img" alt="图片不正确">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="120" align="center"></el-table-column>
      <el-table-column prop="plotType" label="标会类型" width="120" align="center"></el-table-column>
      <el-table-column prop="describe" label="说明"></el-table-column>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="30%" :show-close="false" :before-close="handleClose">
      <el-row :gutter="10">
        <el-col :span="6">类型：</el-col>
        <el-col :span="18">
          <!--          <el-input v-model="dialogContent.type" placeholder="请输入内容"></el-input>-->
          <el-select v-model="dialogContent.type" placeholder="请选择">
            <el-option-group
              v-for="group in typeArr"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">标绘类型：</el-col>
        <el-col :span="18">
          <el-select v-model="dialogContent.plotType" placeholder="请选择">
            <el-option
              v-for="item in plotTypeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">名称：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.name" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">说明：</el-col>
        <el-col :span="18">
          <el-input type="textarea" :rows="2" v-model="dialogContent.describe" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">符号：</el-col>
        <el-col :span="18">
          <el-upload
            action="#"
            :on-change='uploadOnChange'
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :limit="1">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="deleteUnloadPic">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
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
import {addPlotIcon, getPlotIcon, deletePlotIcon, updataPlotIcon} from "@/api/system/plot"

export default {
  name: "index",
  data() {
    return {
      getPicData: [],
      tableData: [],
      total: 0,
      pageSize: 5,
      pageSizes: [5, 10, 20, 40],
      currentPage: 1,
      //-----------弹出对话框-------------
      dialogShow: false,
      dialogTitle: null,
      dialogContent: {
        id: null,
        img: null,
        name: null,
        describe: null,
        type: null,
        plotType: null,
      },
      plotTypeArr: [
        {
          value: '点图层',
          label: '点图层'
        },
        {
          value: '线图层',
          label: '线图层'
        },
        {
          value: '面图层',
          label: '面图层'
        },
      ],
      typeArr: [
        {
          label: '次生灾害类',
          options: [
            {
              value: 'I类（次生地质灾害）',
              label: 'I类（次生地质灾害）'
            },
            {
              value: 'II类（建筑物破坏类）',
              label: 'II类（建筑物破坏类）'
            },
            {
              value: 'III类（交通设施破坏类）',
              label: 'III类（交通设施破坏类）'
            },
            {
              value: 'IV类（生命线工程破坏类）',
              label: 'IV类（生命线工程破坏类）'
            },
            {
              value: 'V类（水利工程破坏类）',
              label: 'V类（水利工程破坏类）'
            },
            {
              value: 'VI类（安全生产事故类）',
              label: 'VI类（安全生产事故类）'
            },
          ]
        },
        {
          label: '应急避难类',
          options: [
            {
              value: 'I类（应急避难功能区类）',
              label: 'I类（应急避难功能区类）'
            },
            {
              value: 'II类（应急避难设施设备类）',
              label: 'II类（应急避难设施设备类）'
            },
            {
              value: 'III类（应急避难场所类）',
              label: 'III类（应急避难场所类）'
            }
          ]
        }
      ],
      fileList: [],
    }
  },
  mounted() {
    this.getPlotPicture()
  },
  methods: {
    //查全部标绘图片数据
    getPlotPicture() {
      let that = this
      getPlotIcon().then(res => {
        that.getPicData = res
        that.total = res.length
        that.tableData = that.getPageArr(res)
      })
    },
    // 在dialog对话框中上传img时触发
    async uploadOnChange(file, fileList) {
      let imgBase64 = await this.getBase64(file.raw)
      console.log(imgBase64)
      this.dialogContent.img = imgBase64
    },
    // 图片转成base64
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file);
        // 开始转
        reader.onload = () => {
          fileResult = reader.result;
        };
        // 转 失败
        reader.onerror = (error) => {
          reject(error);
        };
        // 转 结束
        reader.onloadend = () => {
          resolve(fileResult);
        };
      });
    },
    // 删除dialog中上传里的fileList里的img
    deleteUnloadPic(file) {
      this.fileList = []
    },
    // 删除单个标绘图片
    handleDelete(row) {
      let that = this
      deletePlotIcon({id: row.id}).then(res => {
        that.getPlotPicture()
      })
    },
    // 点击新增或修改打开dialog对话框
    handleOpen(title, row) {
      if (title === "新增") {
        this.dialogTitle = title
      } else {
        this.dialogTitle = title
        this.dialogContent = {...row}
        this.fileList.push({name: row.name + '.jpeg', url: this.dialogContent.img})
      }
      this.dialogShow = !this.dialogShow
    },
    // 确认提交修改或新增的图片
    commit() {
      let that = this
      if (this.dialogTitle === "新增") {
        this.dialogContent.id = Date.now()
        addPlotIcon(this.dialogContent).then(res => {
          that.getPlotPicture()
          that.dialogShow = false
        })
      } else {
        updataPlotIcon(this.dialogContent).then(res => {
          that.getPlotPicture()
          that.dialogShow = false
        })
      }
      this.clearDialogContent()
    },
    // 关闭dialog对话框
    cancel() {
      this.dialogShow = false
      this.clearDialogContent()
    },
    // 清除DialogContent中的数据
    clearDialogContent() {
      Object.keys(this.dialogContent).forEach(key => {
        this.dialogContent[key] = null
      });
      this.fileList = []
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
        arr.push(this.getPicData[start])
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


    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },


  },
}
</script>

<style scoped>

</style>
