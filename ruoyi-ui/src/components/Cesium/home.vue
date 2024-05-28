<template>
  <div class="content-body">
    <div class="header">
      <div class="header-left">
        <span>雅安市地震应急信息服务技术支撑平台</span>
      </div>
      <div class="header-time">
        <span id="time">{{ nowtime }}</span>
      </div>
    </div>

    <div class="content">
      <div class="content-con">
        <div class="left-body">
          <div class="left-top public-bg">
            <div class="public-title">最新地震新闻</div>
            <div class="top-body">
              <newInfo/>
            </div>
          </div>
          <div class="left-con public-bg">
            <div class="public-title">图表</div>
            <chart3/>
          </div>
          <div class="left-bottom public-bg">
            <div class="public-title">图表</div>
            <chart2/>
          </div>
        </div>

        <div class="center-body">
          <eMap/>
        </div>

        <div class="right-body">
          <div class="right-top public-bg">
            <div class="public-title">列表</div>
            <eqTable/>
          </div>
          <!--          <div class="right-con public-bg">-->
          <!--            <div class="public-title">图表</div>-->

          <!--          </div>-->
          <div class="right-bottom public-bg">
            <div class="public-title">图表</div>
            <chart1/>
          </div>
        </div>
      </div>
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
  name: "home",
  data() {
    return {
      backgroundImg: backgroundImg,
      nowtime: null
    }
  },
  mounted(){
    setInterval(() => {
      this.nowtime = this.nowTime()
    }, 500);
  },
  components: {
    eMap, eqTable, listInfo, newInfo, chart1, chart2, chart3
  },
  methods: {
    go() {
      let route = this.$router.resolve({path: '/thd'}).href
      window.open(route, '_blank');
    },
    nowTime() {
      let myDate = new Date();
      let myYear = myDate.getFullYear() //获取完整的年份(4位,1970-????)
      let myMonth = myDate.getMonth() + 1 //获取当前月份(0-11,0代表1月)
      let myToday = myDate.getDate() //获取当前日(1-31)
      let myDay = myDate.getDay() //获取当前星期X(0-6,0代表星期天)
      let myHour = myDate.getHours() //获取当前小时数(0-23)
      let myMinute = myDate.getMinutes() //获取当前分钟数(0-59)
      let mySecond = myDate.getSeconds() //获取当前秒数(0-59)
      let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      let nowTime = myYear + '年' + this.fillZero(myMonth) + '月' + this.fillZero(myToday) + '日' + this.fillZero(myHour) + ':' + this.fillZero(myMinute) + ':' + this.fillZero(mySecond) +  week[myDay]
      return nowTime
    },
    fillZero(str) {
      let realNum;
      if (str < 10) {
        realNum = '0' + str;
      } else {
        realNum = str;
      }
      return realNum;
    }
  }
}
</script>
<style scoped>
/** {*/
/*  margin: 0;*/
/*  padding: 0;*/
/*}*/

/*body {*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  overflow: auto;*/
/*}*/

.public-bg {
  background: rgba(12, 26, 63, 0.3);
}

.public-title {
  width: calc(100% - 20px);
  height: 30px;
  position: relative;
  top: 0;
  left: 5px;
  color: white;
  padding-left: 16px;
  line-height: 30px;
  font-size: 13px;
}

.public-title:before {
  width: 4px;
  height: 20px;
  top: 5px;
  position: absolute;
  content: "";
  background: #2997e4;
  border-radius: 2px;
  left: 5px;
}

.content-body {
  width: 100%;
  height: 100%;
  background: #0d325f;
  background-size: 100% 100%;
  position: absolute;

}

.header {
  height: 70px;
  width: 100%;
  /*    border: 1px solid red;*/
}

.header .header-left {
  width: 50%;
  float: left;
  line-height: 70px;

}

.header .header-left span {
  color: #ffffff;
  font-weight: bold;
  font-size: 24px;
  letter-spacing: 2px;
  padding: 0 20px;
}

.header .header-time {
  width: 48%;
  line-height: 70px;
  float: right;
  text-align: right;
  padding-right: 20px;
}

.header .header-time span {
  color: #ffffff;

}

.content {
  width: 100%;
  height: calc(100% - 75px);
  position: absolute;
}

.content .content-con {
  height: 100%;
}

.content .content-con .left-body {
  width: 22%;
  height: 100%;
  float: left;
  margin: 0 0.3%;
}

.left-body .left-top {
  width: 100%;
  height: 27%;
}

.left-body .left-top .top-body {
  width: 100%;
  height: calc(100% - 30px);
}

.left-body .left-top .top-body .top-left {
  float: left;
  width: 50%;
  height: 100%;
}

.top-left-title {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}

.top-left-title h6 {
  color: #bad0e2;
}

.top-left-title span {
  margin-top: 30px;
  display: inline-block;
  color: #2aa4f1;

  /*    height: 80px;
      line-height: 80px;*/
}

.top-left-title span b {
  font-size: 30px;
  letter-spacing: 5px;
}

.top-left-title img {
  width: 80%;
}

.left-body .left-top .top-body .top-right {
  float: left;
  width: 50%;
  height: 100%;
}

.left-body .left-con {
  width: 100%;
  height: 38%;
  margin-top: 1.6%;
}

.title-nav {
  width: 100%;
  height: calc(100% - 30px);
}

.left-body .left-bottom {
  width: 100%;
  height: 32%;
  margin-top: 1.6%;
}

.center-body {
  width: 44%;
  height: 100%;
  margin: 0 0.3%;
  float: left;
  /*border: 1px solid red;*/
}

.center-body .map {
  width: 100%;
  height: 100%;
}

.right-body {
  width: 32%;
  height: 100%;
  float: right;
  margin: 0 0.3%;
}

.right-body .right-top {
  width: 100%;
  height: 58%;
}

.title-nav .top5-ul {
  width: calc(100% - 20px);
  height: calc(100% - 30px);
  padding: 10px;
}

.title-nav .top5-ul ul {
  width: 100%;
  height: 100%;
}

.title-nav .top5-ul ul, li {
  list-style: none;
}

.title-nav .top5-ul ul > li {
  width: 100%;
  height: 20%;
  color: #ffffff;
  line-height: 68px;
  justify-content: center;
}

.title-nav .top5-ul ul li span {
  margin-left: 3%;
  font-size: 14px;
}

.title-nav .top5-ul ul li span:nth-child(1) {
  color: #EB6841;
  font-style: oblique;
  /*width: 10%;*/
  /*#20a8fe
          #EB6841
          #3FB8AF
          #FE4365
          #FC9D9A*/
  display: inline-block;
  text-align: center;
  font-size: 20px;
}

.title-nav .top5-ul ul li span:nth-child(2) {
  width: 10%;
  display: inline-block;
  text-align: center;

  height: 30px;
  line-height: 30px;
  /*    height: 100%;*/
  /*line-height: 100%;*/
  vertical-align: center;
  border-radius: 5px;
  color: #ffffff;
}

.title-nav .top5-ul ul li:nth-child(1) span:nth-child(2), .title-nav .top5-ul ul li:nth-child(2) span:nth-child(2), .title-nav .top5-ul ul li:nth-child(3) span:nth-child(2) {
  background: #d89346;
}

.title-nav .top5-ul ul li:nth-child(4) span:nth-child(2), .title-nav .top5-ul ul li:nth-child(5) span:nth-child(2) {
  background: #1db5ea;
}

.title-nav .top5-ul ul li span:nth-child(3) {
  /*width: 15%;*/
  display: inline-block;
  text-align: center;
}

.title-nav .top5-ul ul li span:nth-child(4) {
  /*width: 15%;*/
  display: inline-block;
  text-align: center;
}

.title-nav .top5-ul ul li span:nth-child(5) {
  /*width: 20%;*/
  display: inline-block;
  text-align: center;
}

.title-nav .top5-ul ul li span:nth-child(6) {
  display: inline-block;
  text-align: center;
}

.right-body .right-con {
  width: 100%;
  height: 25%;
  margin-top: 2%;
}

.right-body .right-bottom {
  width: 100%;
  height: 39%;
  margin-top: 2%;
}
</style>
