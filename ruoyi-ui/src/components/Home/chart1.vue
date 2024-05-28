<template>
  <div ref="chart1" class="chart1"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "chart1",
  mounted() {
    this.initChart()
  },
  methods:{
    initChart(){
      let chart1 = this.$refs.chart1
      let myChart = echarts.init(chart1);
      let option = {
        title: {
          // text: 'Stacked Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          textStyle:{
            color: '#fff'
          },
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          data: ['Mon1', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: '13',
              color: '#fff'
            }
          },
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.chart1{
  /*height: calc(30vh - 30px);*/
  /*border-radius: 10px;*/
  /*background: rgba(4, 16, 51, 0.4);*/
  /*margin: 10px;*/
  width: 100%;
  height: 100%;
}
</style>
