<template>
  <div class="newIn">
<!--    <el-col>-->
<!--      <div class="eqtitle">-->
<!--        最新地震-->
<!--      </div>-->
<!--    </el-col>-->
    <el-col>
      <div class="eqName">
        {{ eqName }}
      </div>
    </el-col>
    <el-col>
      <div class="time newColCommon">
        发震时间：{{ time }}
      </div>
    </el-col>
    <el-col>
      <div class="lonlat newColCommon">
        震中经纬：{{ longitude }},{{latitude}}
      </div>
    </el-col>
    <el-col>
      <div class="magnitude newColCommon">
        地震震级：{{ magnitude }}
      </div>
    </el-col>
    <el-col>
      <div class="depth newColCommon">
        震源深度：{{ depth }}
      </div>
    </el-col>
    <el-col>
      <div class="position newColCommon">
        参考位置：{{ position }}
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "newInfo",
  data() {
    return {
      eqName: '四川德阳市绵竹市3.0级地震',
      position:'四川德阳市绵竹市',
      time:'2024-05-15 08:49:10',
      magnitude:'3.0',
      longitude:'104.05',
      latitude:'31.55',
      depth:'13'
    }
  }
}
</script>

<style scoped>
.newIn{
  color: #fff;
  /*height: calc(40vh - 35px);*/
  /*background: rgba(4, 16, 51, 0.4);*/
  /*border-radius: 10px;*/
  width: 100%;
  height: 100%;
  /*margin: 10px;*/
}
.newColCommon{
  /*margin-top: 10px;*/
  padding-left: 10px;
}
/*.eqtitle{*/
/*  margin-top: 10px;*/
/*  font-size: 20px;*/
/*  border-left-width: 5px;*/
/*  border-left-style: solid;*/
/*  border-left-color: rgb(86 253 237);*/
/*  padding-left: 10px;*/
/*}*/
.eqName{
  text-align: center;
  /*margin-top: 10px;*/
}
</style>
