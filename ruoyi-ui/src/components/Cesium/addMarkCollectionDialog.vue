<template>
  <el-dialog class="dialogDiv" :visible.sync="DialogFormVisible" title="添加标注信息" width="500"
             :close-on-click-modal="false" :destroy-on-close="true" :show-close="false">
    <el-form :model="this.form">
      <el-form-item label="标注类型" :label-width="formLabelWidth">
        <el-input placeholder="请输入内容" v-model="form.type" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="时间" :label-width="formLabelWidth">
        <div class="formTime">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="经度" :label-width="formLabelWidth">
        <el-input v-model="form.lon" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="纬度" :label-width="formLabelWidth">
        <el-input v-model="form.lat" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.describe" :rows="2" type="textarea" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancelAddNote">取消</el-button>
      <el-button type="primary" @click="commitAddNote">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from "element-ui";
import * as Cesium from 'cesium'

export default {
  name: "addMarkDialog",
  data() {
    return {
      formLabelWidth: '140px',
      DialogFormVisible: false,
      form: {},
    }
  },
  props: [
    'addMarkDialogFormVisible', 'pointInfo'
  ],
  watch: {
    addMarkDialogFormVisible() {
      this.DialogFormVisible = this.addMarkDialogFormVisible
    },
    pointInfo: {
      deep: true,// addMarkForm需要开启深度监听，否则监听不到变化
      handler() {
        // 加上判断是因为当清空pointInfo时会再次触发，form变成null造成el-form报错
        if(this.pointInfo){
          this.form = this.pointInfo
        }
      }
    },
  },
  methods: {
    // 取消添加标注
    cancelAddNote() {
      this.$emit('clearMarkDialogForm')// 调用父组件中clearMarkDialogForm对应的方法，重置标绘信息填写框里的信息
    },
    //确认添加标注
    commitAddNote() {
      let that = this
      this.$emit('drawPoint',this.form)
      // let test = {...that.form}
      // console.log(that.form,test,123)
      this.$emit('wsSendPoint', JSON.stringify({type: "point", operate: "add", data: that.form}))
      this.$emit('clearMarkDialogForm') // 调用父组件中clearMarkDialogForm对应的方法，重置标绘信息填写框里的信息
      Message({
        message: '添加成功',
        type: 'success',
      })
    },
  }
}
</script>

<style scoped>
.dialogDiv {
  position: absolute;
  /*padding: 20px;*/
  /*border-radius: 5px;*/
  /*top:100px;*/
  /*left: 10px;*/
  z-index: 10; /* 更高的层级 */
  /*background-color: rgba(40, 40, 40, 0.7);*/
}
</style>
