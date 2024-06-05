<template>
  <div class="videoMonitorWin" v-if="visiblePanel" :style="styleObject">
    <div class="ponpTitle">信息面板</div>
    <table class="ponpTable">
      <tbody>
        <tr class="info-item">
          <td>标注类型</td>
          <td>{{this.popupPanelData.type}}</td>
        </tr>
        <tr class="info-item">
          <td>时间</td>
          <td>{{this.popupPanelData.time}}</td>
        </tr>
        <tr class="info-item">
          <td>名称</td>
          <td>{{this.popupPanelData.name}}</td>
        </tr>
        <tr class="info-item">
          <td>经度</td>
          <td>{{this.popupPanelData.lon}}</td>
        </tr>
        <tr class="info-item">
          <td>纬度</td>
          <td>{{this.popupPanelData.lat}}</td>
        </tr>
        <tr class="info-item" >
          <td>描述</td>
          <td style="text-align: left;">{{this.popupPanelData.describe}}</td>
        </tr>
      </tbody>
    </table>
    <el-button  @click="deletePoint" type="danger" icon="el-icon-delete" circle></el-button>
  </div>
</template>
<script>

export default {
  data(){
    return{
      visiblePanel:null,
      positionEntity:{ x: 0, y: 0 },
      popupPanelData:{},
    }
  },
  props: [
      'popupData','position','visible'
  ],
  watch:{
    visible(){
      this.visiblePanel = this.visible
    },
    popupData:{
      deep:true,
      handler(){
        this.popupPanelData = this.popupData
      }
    },
    position(){
      this.positionEntity = this.position
    },
  },
  computed: {
    // 调整弹框位置
    styleObject() {
      return {
        positionEntity: "absolute",
        left: `${this.positionEntity.x}px`,
        top: `${this.positionEntity.y}px`
      };
    }
  },
  methods:{
    // 删除标注
    deletePoint(){
      this.$emit('closePlotPop')
      this.$emit('wsSendPoint',JSON.stringify({type:"point",operate:"delete",id:window.selectedEntity.id}))
    }
  }
};
</script>
<style >
.videoMonitorWin{
  position: absolute;
  width: 600px;
  padding: 20px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
  border: 2px solid #18c9dc;
}
.ponpTitle{
  font-size: 23px;
  text-align: center;
  color: white;
  margin-bottom: 10px;
}
.ponpTable{
  text-align: center;
  color: white;
  margin-bottom: 10px;
}
.ponpTable td{
  padding: 10px;
}
.info-item :nth-child(1){
  width: 15%;
  border-color:#293966;
  border-top-style:solid;
  border-top-width:2px;
  background-color: #293966;
  margin-bottom: 2px;
  align-content: center;
}
.info-item :nth-child(2){
  width: 60%;
  border-color:#4d5469;
  border-top-style:solid;
  border-top-width:2px;
  background-color: #4d5469;
  margin-bottom: 2px;
}

</style>
