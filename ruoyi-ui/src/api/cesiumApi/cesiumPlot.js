import Polyline from "./Polyline";
import Polygon from "./Polygon";
import Point from "./Point"
import * as Cesium from 'cesium'
import {rgb} from "chalk";

let pic = "data:image/png;base64,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"

let cesiumPlot= {
  viewer:null,
  ws:null,
  // 初始化viewer和ws
  init(viewer,ws,store) {
    this.viewer = viewer
    this.ws = ws
    this.store = store
    this.initDrawEdit();
  },
  // 初始化点线面对象
  initDrawEdit() {
    this.point = new Point(this.viewer,this.store)
    this.polyline = new Polyline(this.viewer,this.ws)
    this.polygon = new Polygon(this.viewer,this.ws)
  },

  //------------------------------点---------------------------------
  initPointHandler(pointType,img){
    this.point.initPointHandlder(pointType,img)
  },

  drawPoint(pointInfo){
    this.point.drawPoint(pointInfo)
  },

  deletePoint(point){
    this.point.deletePoint(point)
  },
  //----------------------------------------------------------------

  //------------------------------线---------------------------------
  drawActivatePolyline(type,img) {
    if(type==="量算"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      this.polyline.activate(NORMALLINE);
      return 0
    }
    if(type==="地裂缝"||type==="可用供水管网"||type==="不可用供水管网"){
      let PICTURELINE = new Cesium.ImageMaterialProperty({
        image: img,
        repeat: new Cesium.Cartesian2(3, 1),
      })
      this.polyline.activate(PICTURELINE,"pic");
      return 0
    }
    if(type==="可通行公路"||type==="限制通行公路"||type==="不可通行公路"){
      let color
      if(type==="可通行公路"){
        color = Cesium.Color.fromBytes(158,202,181)
      }else if(type==="限制通行公路"){
        color = Cesium.Color.fromBytes(206,184,157)
      }else{
        color = Cesium.Color.fromBytes(199,151,149)
      }
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: color,
        dashPattern: parseInt("110000001111", 1),
      })
      this.polyline.activate(NORMALLINE);
      return 0
    }
    if(type==="可通行铁路"||type==="不可通行铁路"){
      let gapColor
      if(type==="可通行铁路"){
        gapColor = Cesium.Color.BLACK
      }else {
        gapColor = Cesium.Color.RED
      }
      let DASHLINE= new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.WHITE,
        gapColor: gapColor,
        dashLength: 100
      })
      this.polyline.activate(DASHLINE);
      return 0
    }
    if(type==="可用输电线路"||type==="不可用输电线路"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      this.polyline.activate(NORMALLINE);
      return 0
    }
    if(type==="可用输气管线"||type==="不可用输气管线"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      this.polyline.activate(NORMALLINE);
      return 0
    }
  },
  deletePolyline(polyline){
    this.polyline.deletePolyline(polyline)
  },
  getDrawPolyline(polylineArr){
    this.polyline.getDrawPolyline(polylineArr)
  },
  // 返回画线时的状态，0:未激活 1:绘制，不加这个条件会触发this.showPolyline,导致删除线按钮一直出现
  drawPolylineStatus() {
    return this.polyline.status
  },
  // 选择当前线的material
  getMaterial(type,img) {
    if(type==="地裂缝"||type==="可用供水管网"||type==="不可用供水管网"){
      let PICTURELINE = new Cesium.ImageMaterialProperty({
        image: img,
        repeat: new Cesium.Cartesian2(3, 1),
      })
      return PICTURELINE
    }
    if(type==="可通行公路"||type==="限制通行公路"||type==="不可通行公路"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.CYAN,
          dashPattern: parseInt("110000001111", 1),
        })
      return NORMALLINE
    }
    if(type==="可通行铁路"||type==="不可通行铁路"){
      let DASHLINE= new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 2),
      })
      return DASHLINE
    }
    if(type==="可用输电线路"||type==="不可用输电线路"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      return NORMALLINE
    }
    if(type==="可用输气管线"||type==="不可用输气管线"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      return NORMALLINE
    }
  },
  //-----------------------------------------------------------------

  //------------------------------面---------------------------------
  drawActivatePolygon() {
    this.polygon.activate()
  },
  deletePolygon(polygon){
    this.polygon.deletePolygon(polygon)
  },
  getDrawPolygon(polygonArr){
    this.polygon.getDrawPolygon(polygonArr)
  }
  //----------------------------------------------------------------


}
export default cesiumPlot;
