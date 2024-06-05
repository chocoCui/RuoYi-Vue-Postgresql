import * as Cesium from 'cesium'
import {markPhotoList, matchMark, refenceMarkPhotoList} from "@/api/cesiumApi/tool"

import {Entity, PolygonHierarchy} from "cesium";
import {promises} from "readline";

export default class Point {
  constructor(viewer, store) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this.store = store
    this.list = matchMark()
    this.refenceTypeList = refenceMarkPhotoList()
  }
  // 画点的屏幕事件
  initPointHandlder(pointType,img) {
    let viewer = this.viewer
    let that = this
    that.handler.setInputAction((event) => {
      let pointInfo = {
        lat: null,
        lon: null,
        height: null,
        img: null,
        type: null,
        id: null,
      }
      // 1-1 获取点击的位置的坐标信息（经度、纬度、高度）
      let ray = viewer.camera.getPickRay(event.position)
      let position = viewer.scene.globe.pick(ray, viewer.scene)
      // 1-2 坐标系转换
      let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
      let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
      let lat = Cesium.Math.toDegrees((cartographic.latitude))
      let height = cartographic.height
      // 1-3 点开弹窗中就有经纬度，并且把经纬度图片等信息存入store中
      pointInfo.lat = lat.toFixed(6)
      pointInfo.lon = lon.toFixed(6)
      pointInfo.height = height
      pointInfo.img = img//that.matchIcon(pointType)
      pointInfo.type = pointType//that.refenceTypeList[pointType]
      pointInfo.id = Date.now()
      that.store.commit('SET_POINTINFO1', pointInfo)
      // 1-4 移除此handler
      that.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  // 画点
  drawPoint(pointInfo) {
    window.viewer.entities.add({
      id: pointInfo.id,
      position: Cesium.Cartesian3.fromDegrees(Number(pointInfo.lon), Number(pointInfo.lat), Number(pointInfo.height)),
      billboard: {
        image: pointInfo.img,
        width: 50,//图片宽度,单位px
        height: 50,//图片高度，单位px // 会影响point大小，离谱
        eyeOffset: new Cesium.Cartesian3(0, 0, 0),//与坐标位置的偏移距离
        color: Cesium.Color.WHITE.withAlpha(1),//颜色
        scale: 0.8,//缩放比例
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
        depthTest: false,//禁止深度测试但是没有下面那句有用
        disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
      },
      properties: {
        type: pointInfo.type,
        lon: pointInfo.lon,
        lat: pointInfo.lat,
        id: pointInfo.id,
        height: pointInfo.height,
        img: pointInfo.img,
        describe: pointInfo.describe,
        time: pointInfo.time,
        name: pointInfo.name,
      }
    })
  }
  // 删除点
  deletePoint(point){
    viewer.entities.remove(point)
  }
  //匹配图标
  matchIcon(type) {
    let list = matchMark() // 封装的marchMark
    return list[type]
  }
}
