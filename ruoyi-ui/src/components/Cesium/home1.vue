<template>
  <div class="home">
<!--    <button @click="go()">123</button>-->
    <div class="backgroundImg" style="">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div class="emap">
              <eMap />
            </div>
            <div class="eqtable">
              <eqTable />
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <div class="newInfo">
              <newInfo />
            </div>
            <div class="listInfo">
              <listInfo />
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light-1">
            <div class="eqEcharts">
              <chart1 />
            </div>
            <div class="eqEcharts">
              <chart2 />
            </div>
            <div class="eqEcharts">
              <chart3 />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import eMap from '@/components/Home/emap.vue'
import eqTable from '@/components/Home/eqtable.vue'
import listInfo from '@/components/Home/listInfo.vue'
import newInfo from '@/components/Home/newInfo.vue'
import chart1 from '@/components/Home/chart1.vue'
import chart2 from '@/components/Home/chart2.vue'
import chart3 from '@/components/Home/chart3.vue'
import backgroundImg from '@/assets/home/homebackground.png'
export default {
  name:"home",
  data(){
    return{
      backgroundImg:backgroundImg
    }
  },
  computed:{
    backgroundImgC(){
      return {
        backgroudImage: backgroundImg
      }
    }
  },
  components:{
    eMap,eqTable,listInfo,newInfo,chart1,chart2,chart3
  },
  methods:{
    go(){
      let route = this.$router.resolve({path: '/thd'}).href
      window.open(route, '_blank');
    },
  }
}
</script>
<style scoped>
.home{
  padding-top: 20px;
  background-color: rgba(4,14,46,1);
}
.backgroundImg{
  background-image: url('~@/assets/home/homebackground.png');
  background-size: cover;
}
.grid-content-header{
  height: 40px;
}
.grid-content {
  height: calc(90vh - 48px);
}
.emap{
  background-image: url('~@/assets/home/map.png');
  background-position: 55% 188%;
  background-size: 1000px 300px;
  background-repeat: no-repeat;
}
.eqtable{
  /*height: calc(30vh - 24px);*/
  /*border-radius: 10px;*/
  /*background: rgba(4, 16, 51, 0.4);*/
}
.newInfo{
  /*height: calc(40vh - 24px);*/
  /*background: rgba(4, 16, 51, 0.4);*/
  /*border-radius: 10px;*/
}
.listInfo{
  /*height: calc(50vh - 24px);*/
  /*border-radius: 10px;*/
  /*background: rgba(4, 16, 51, 0.4);*/
}
.eqEcharts{
  /*height: calc(30vh - 16px);*/
  /*border-radius: 10px;*/
  /*background: rgba(4, 16, 51, 0.4);*/
}


.bg-purple-dark {
  background: #99a9bf;
}
/*.bg-purple {*/
/*  background: #d3dce6;*/
/*}*/
/*.bg-purple-light {*/
/*  background: #e5e9f2;*/
/*}*/
/*.bg-purple-light-1 {*/
/*  background: #eaeaec;*/
/*}*/

</style>
