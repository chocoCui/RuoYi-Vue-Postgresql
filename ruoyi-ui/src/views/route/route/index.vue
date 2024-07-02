<template>
  <div id="cesiumContainer">
    <el-form class="tool-container">
      <el-button class="el-button--primary" @click="route">路径规划</el-button>
      <el-button class="el-button--primary" @click="addArea">添加障碍区域</el-button>
      <el-button class="el-button--primary" @click="removeAll">清空所有实体</el-button>
      <el-button class="el-button--primary" @click="removePoint">删除障碍区域</el-button>
      <el-button class="el-button--primary" @click="removePolyline">删除路径规划</el-button>
    </el-form>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'
import CesiumNavigation from "cesium-navigation-es6";
import {initCesium} from '@/api/cesiumApi/initCesium'
// import geojsonmap from '@/assets/geoJson/map.json'
// import geojsonmap from '@/assets/geoJson/YaanRoadGeoJson.json'
import axios from "axios";
import start from '@/assets/start.svg'
import end from '@/assets/end.svg'
import {Entity} from "cesium";

export default {
  name: "index",
  data(){
    return{
      pos:[],
      areas:[]
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    init() {
      let viewer = initCesium(Cesium)
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
      window.viewer = viewer
      let options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Cartographic.fromDegrees(103.00, 29.98, 1500, new Cesium.Cartographic)
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true
      options.resetTooltip = "重置视图";
      options.zoomInTooltip = "放大";
      options.zoomOutTooltip = "缩小";
      //新版必须new  CesiumNavigation ,可以查看作者github
      window.navigation = new CesiumNavigation(viewer, options)
      document.getElementsByClassName('cesium-geocoder-input')[0].placeholder = '请输入地名进行搜索'
      document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[0].innerHTML = '影像服务'
      document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[1].innerHTML = '地形服务'

      // 添加路网
      // viewer.dataSources.add(
      //   Cesium.GeoJsonDataSource.load(
      //     geojsonmap,
      //     {
      //       stroke: Cesium.Color.RED,   // 边框颜色
      //       // fill: Cesium.Color.RED.withAlpha(0.5),  // 填充颜色
      //       strokeWidth: 3, // 边框宽度
      //     })
      // );

    },
    /** 计算两个坐标的距离，单位米 **/
    Distance(lng1, lat1, lng2, lat2) {
      //采用Haversine formula算法，高德地图的js计算代码，比较简洁 https://www.cnblogs.com/ggz19/p/7551088.html
      let d=Math.PI/180;
      let f=lat1*d, h=lat2*d;
      let i=lng2*d - lng1*d;
      let e=(1 - Math.cos(h - f) + (1 - Math.cos(i)) * Math.cos(f) * Math.cos(h)) / 2;
      return 2 * 6378137 * Math.asin(Math.sqrt(e));
    },
    /** 以坐标点为中心，简单粗略的创建一个指定半径的圆，半径单位米，pointCount为构建圆的坐标点数（比如24个点，点越多越圆，最少3个点），返回构成圆的坐标点数组 **/
    CreateSimpleCircle(lng, lat, radius, pointCount){
      //球面坐标不会算，转换成三角坐标简单点，经度代表值大约：0.01≈1km 0.1≈10km 1≈100km 10≈1000km
      let km=radius/1000;
      let a=km<5?0.01 :km<50?0.1 :km<500?1 :10;
      let b=this.Distance(lng, lat, lng+a, lat);
      let c=this.Distance(lng, lat, lng, lat+a);
      let rb=radius/b*a;
      let rc=radius/c*a;
      let arr=[];
      let n=0,step=360.0/pointCount,N=360-step/2; //注意浮点数±0.000000001的差异
      for(let i=0;n<N;i++,n+=step){
        let x=lng+rb*Math.cos(n*Math.PI/180);
        let y=lat+rc*Math.sin(n*Math.PI/180);
        arr[i]=[x, y];
      }
      arr.push([arr[0][0], arr[0][1]]); //闭环
      return arr;
    },
    route(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      let that =this
      let propertiesId = []
      handler.setInputAction((event) => {

        // 1-1 获取点击的位置的坐标信息（经度、纬度、高度）
        let ray = viewer.camera.getPickRay(event.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // // 1-2 坐标系转换
        let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
        let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
        let lat = Cesium.Math.toDegrees((cartographic.latitude))
        that.pos.push([lon,lat])
        let billBoardId = Date.now()
        if(that.pos.length===1){
          that.billboardD(position,start,billBoardId)
          propertiesId.push(billBoardId)
        }else {
          that.billboardD(position,end,billBoardId)
          propertiesId.push(billBoardId)
        }
        if(that.pos.length===2){
          axios.post('http://192.168.0.107:8089/map_test/way', { // 'http://127.0.0.1:8089/map_test/way'
            pathWay:that.pos,
            hardAreas:that.areas
          }).then(function (response) {
            console.log(response.data,123)
              that.polylineD(response.data.path,propertiesId)
              that.pos = []
          }).catch(err=>{
            alert("无可行路径")
          })
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    polylineD(data,propertiesId){
      let arr = []
      for(let i=0;i<data.length;i++){
        let c3 = Cesium.Cartesian3.fromDegrees(data[i][0],data[i][1])
        // let cartographic = Cesium.Cartographic.fromDegrees(data[i][0],data[i][1])
        // let cartesian3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic)
        arr.push(c3)
      }
      viewer.entities.add({
        polyline: {
          positions: arr,
          width: 10,
          depthFailMaterial: Cesium.Color.YELLOW,
          clampToGround: true,
        },
        properties: {
          propertiesId
        }
      })
    },
    polygonD(positions,id){
      let arr = []
      for(let i=0;i<positions.length;i++){
        let a = Cesium.Cartesian3.fromDegrees(positions[i][0],positions[i][1])
        arr.push(a)
      }
      let polygon = new Entity({
        id:id  ,
        polygon: {
          hierarchy: arr,
          material: new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
          clampToGround: true,
        },
        properties: {
        }
      })
      viewer.entities.add(polygon)
    },
    pointD(position,id){
      return viewer.entities.add({
        id:id,
        position: position,
        point: {
          pixelSize: 20,
          color: Cesium.Color.RED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
      })
    },
    billboardD(position,img,billBoardId){
      viewer.entities.add({
        id:billBoardId,
        position: position,
        billboard: {
          image: img,
          // width: 25,//图片宽度,单位px
          // height: 25,//图片高度，单位px // 会影响point大小，离谱
          // eyeOffset: new Cesium.Cartesian3(-1, 1, 0),//与坐标位置的偏移距离
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
      })
    },
    addArea(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      let that = this
      handler.setInputAction((event) => {
        // 1-1 获取点击的位置的坐标信息（经度、纬度、高度）
        let ray = viewer.camera.getPickRay(event.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // // 1-2 坐标系转换
        let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
        let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
        let lat = Cesium.Math.toDegrees((cartographic.latitude))
        let ar = that.CreateSimpleCircle(lon,lat,50,24)
        that.areas.push({"area":ar,"name":'area_'+Date.now()})
        let id = 'area_'+Date.now()
        that.pointD(position,id)
        that.polygonD(ar,id+'a')
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    removeAll(){
      viewer.entities.removeAll();
      this.areas = []
    },
    removePoint(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      let that = this
      handler.setInputAction(async (click) => {
        let pickedEntity = window.viewer.scene.pick(click.position);
        // let entity = window.selectedEntity = pickedEntity?.id
        let entity = pickedEntity?.id
        if (Cesium.defined(pickedEntity) && entity._point !== undefined) {
          let id = entity.id
          that.areas = that.areas.filter(area=>area.name !== id)
          viewer.entities.remove(entity)
          viewer.entities.removeById(id+'a')
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    removePolyline(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      handler.setInputAction(async (click) => {
        let pickedEntity = window.viewer.scene.pick(click.position);
        let entity = window.selectedEntity = pickedEntity?.id
        if (Cesium.defined(pickedEntity) && window.selectedEntity._polyline !== undefined) {
          let propertiesId = entity.properties.propertiesId._value
          for(let i=0;i<propertiesId.length;i++){
            console.log(propertiesId[i],propertiesId[i]+"")
            viewer.entities.removeById(propertiesId[i]+"")
          }
          viewer.entities.remove(entity)
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
}
</script>

<style scoped>
.cesium-viewer-navigationContainer {
  display: none !important;
}
.tool-container {
  position: absolute;
  padding: 15px;
  border-radius: 5px;
  /*width: 500px;*/
  /*height: 200px;*/
  top: 10px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}
#cesiumContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.eqListfade-enter-active, .eqListfade-leave-active {
  transition: opacity .5s;
}

.eqListfade-enter, .eqListfade-leave-to {
  opacity: 0;
}

.button-container {
  position: absolute;
  padding: 15px;
  border-radius: 5px;
  top: 10px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.latlon-legend {
  pointer-events: auto;
  position: absolute;
  border-radius: 15px;
  padding-left: 5px;
  padding-right: 5px;
  bottom: 30px;
  height: 30px;
  width: 125px;
  box-sizing: content-box;
}

.modelAdj {
  color: white;
  margin-bottom: 15px;
}
</style>
