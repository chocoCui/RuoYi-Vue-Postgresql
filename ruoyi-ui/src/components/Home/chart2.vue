<template>
  <div ref="chart2" class="chart2"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "chart2",
  mounted() {
    this.initChart()
  },
  methods:{
    initChart(){
      let chart2 = this.$refs.chart2
      let myChart = echarts.init(chart2);
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {

          left: '3%',
          right: '4%',
          top: '10%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
        },
        series: [
          {
            data: [
              120,
              {
                value: 200,
                itemStyle: {
                  color: '#a90000'
                }
              },
              150,
              80,
              70,
              110,
              130
            ],
            type: 'bar'
          }
        ]
      };
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.chart2{
  /*height: calc(30vh - 30px);*/
  /*border-radius: 10px;*/
  /*background: rgba(4, 16, 51, 0.4);*/
  /*margin: 10px;*/
  width: 100%;
  height: 100%;
}
</style>
