<template>
  <div ref="eMap" class="eMap"></div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts-gl'
// import YaanJson from '@/assets/geoJson/yaan.json'
// import SiChuanJson from '@/assets/geoJson/sichuan.json'
import data from '@/assets/geoJson/data.json'
// echarts.registerMap('yaan', YaanJson)
// echarts.registerMap('sichuan', SiChuanJson)
echarts.registerMap('data', data)
export default {
  name:'emap',
  mounted() {
    this.initEmap()
  },
  methods:{
    initEmap(){
      let eMapElem = this.$refs.eMap
      let eMap =  echarts.init(eMapElem)
      let option = {
        geo3D:{
          map: 'data',
          show: false,
          // label: {
          //   show: true,
          //   textStyle: {
          //     color: '#fff',
          //     fontSize: 14,
          //   }
          // },
          viewControl:{
            projection:'orthographic',
            orthographicSize : 105,
            alpha:45,
            beta:5,
          },
          itemStyle: { //设置地图板块配置选项
            color:'#0c274b',
            // 图形的描边颜色
            borderColor: '#1cccff',
            // 描边线宽。
            borderWidth: 1.5,
            // 柱条的描边类型。
            borderType: 'solid',
            label: {
              // 显示省份下面市、州的名称
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 400
              }
            },
          },
          emphasis: {
            itemStyle:{
              color: '#3099E2',
            },
            label: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 16,
                fontWeight: 400
              },
            }
          },
        },
        series:[
          {
            type: 'map3D',
            map: 'data',
            // geo3DIndex: 0,
            // label: {
            //   show: true,
            //   textStyle: {
            //     color: '#fff',
            //     fontSize: 14,
            //   }
            // },
            viewControl:{
              projection:'orthographic',
              orthographicSize : 105,
              alpha:45,
              beta:5,
            },
            itemStyle: { //设置地图板块配置选项
                color:'#0c274b',
                // 图形的描边颜色
                borderColor: '#1cccff',
                // 描边线宽。
                borderWidth: 1.5,
                // 柱条的描边类型。
                borderType: 'solid',
                label: {
                  // 显示省份下面市、州的名称
                  show: true,
                  textStyle: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 400
                  }
                },
            },
            emphasis: {
              itemStyle:{
                color: '#3099E2',
              },
              label: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 400
                },
              }
            },
            data:[
              {
                name:'雨城区',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'名山区',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'荥经县',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'汉源县',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'石棉县',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'天全县',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'芦山县',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
              {
                name:'宝兴县',
                itemStyle:{
                  color:'#ea5353',
                },
                emphasis:{
                  itemStyle:{
                    color: '#ef0909',
                  },
                }
              },
            ],
          },
          // {
          //   type: 'scatter3D',
          //   coordinateSystem: 'geo3D',
          //   geo3DIndex: 0,
          //   data:[
          //     {
          //       name: 'ccc',
          //       value:[103.112214,30.084718,1],
          //       pointValue: '98',
          //     },
          //   ],
          //   symbolSize: '20',
          //   symbol: 'circle',
          //   itemStyle: { color: "orange"},
          //   viewControl:{
          //     projection:'orthographic',
          //     orthographicSize : 105,
          //     alpha:45,
          //     beta:5,
          //   },
          // }
        ]
      }
      eMap.setOption(option)
    }
  }
}
</script>

<style>
.eMap{
  width: 100%;
  height: 100%;
}
</style>
