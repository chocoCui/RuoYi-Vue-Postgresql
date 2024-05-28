<template>
  <div ref="chart3" class="chart3"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "chart3",
  mounted() {
    this.initChart()
  },
  methods:{
    initChart(){
      let chart3 = this.$refs.chart3
      let myChart = echarts.init(chart3);
      let option ={
        title: {
          // text: 'Referer of a Website',
          // subtext: 'Fake Data',
          // left: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          top: 'top',
          textStyle:{
            color: '#fff'
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label:{
              color: '#fff'
            },
            labelLine:{
            }
          }
        ]
      };
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.chart3{
  /*height: calc(30vh - 30px);*/
  /*border-radius: 10px;*/
  /*background: rgba(4, 16, 51, 0.4);*/
  /*margin: 10px;*/
  width: 100%;
  height: 100%;
}
</style>
