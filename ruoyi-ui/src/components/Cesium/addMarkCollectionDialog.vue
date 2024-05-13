<template>
  <el-dialog class="dialogDiv" :visible.sync="DialogFormVisible" title="添加标注信息" width="500" :close-on-click-modal="false" :destroy-on-close="true" :show-close="false">
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
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="经度" :label-width="formLabelWidth">
        <el-input v-model="form.lon" autocomplete="off" />
      </el-form-item>
      <el-form-item label="纬度" :label-width="formLabelWidth">
        <el-input v-model="form.lat" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.describe" :rows="2" type="textarea" autocomplete="off" />
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
  data(){
    return{
      formLabelWidth: '140px',
      DialogFormVisible:false,
      form:{},
      type:"",
    }
  },
  props:[
    'addMarkDialogFormVisible','addMarkForm'
  ],
  watch:{
    addMarkDialogFormVisible(){
      this.DialogFormVisible = this.addMarkDialogFormVisible
    },
    addMarkForm:{
      deep:true,// addMarkForm需要开启深度监听，否则监听不到变化
      handler(){
        this.form = this.addMarkForm
      }
    },

  },
  methods:{

    // 取消添加标注
    cancelAddNote(){
      // window.noteHandler.destroy()
      window.noteHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.$emit('clearMarkDialogForm')// 调用父组件中clearMarkDialogForm对应的方法，重置标绘信息填写框里的信息
    },
    //确认添加标注
    commitAddNote(){
      let that = this
      this.addIcon(this.form)
      window.noteHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.$emit('wsSend',JSON.stringify({type:"point",operate:"add",data:that.form}))
      // window.noteHandler.destroy()//使用后销毁handler，销毁后window中还有noteHandler吗？
      this.$emit('clearMarkDialogForm') // 调用父组件中clearMarkDialogForm对应的方法，重置标绘信息填写框里的信息
      Message({
        message: '添加成功',
        type: 'success',
      })
    },
    // 添加标注
    addIcon(pos){
      let that = this
      window.viewer.entities.add({
        id:that.form.id,
        position: Cesium.Cartesian3.fromDegrees(Number(pos.lon) , Number(pos.lat), Number(pos.height)),
        billboard: {
          image: that.form.img,
          // width: 200,//图片宽度,单位px
          // height: 200,//图片高度，单位px // 会影响point大小，离谱
          eyeOffset: new Cesium.Cartesian3(0, 0, 0),//与坐标位置的偏移距离
          color: Cesium.Color.WHITE.withAlpha(1),//颜色
          scale: 0.8,//缩放比例
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
        properties:{
          type:that.form.type,
          time:that.form.time,
          name:that.form.name,
          lon:that.form.lon,
          lat:that.form.lat,
          describe:that.form.describe,
          id:that.form.id
        }
      })
    },

  }
}
</script>

<style scoped>
.dialogDiv{
  position: absolute;
  /*padding: 20px;*/
  /*border-radius: 5px;*/
  /*top:100px;*/
  /*left: 10px;*/
  z-index: 10; /* 更高的层级 */
  /*background-color: rgba(40, 40, 40, 0.7);*/
}
</style>
