import Polyline from "./Polyline";
import Polygon from "./Polygon";
import Point from "./Point"

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
  initPointHandler(pointType){
    this.point.initPointHandlder(pointType,this.store)
  },

  drawPoint(pointInfo){
    this.point.drawPoint(pointInfo)
  },

  deletePoint(point){
    this.point.deletePoint(point)
  },
  //----------------------------------------------------------------

  //------------------------------线---------------------------------
  drawActivatePolyline() {
    this.polyline.activate();
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
