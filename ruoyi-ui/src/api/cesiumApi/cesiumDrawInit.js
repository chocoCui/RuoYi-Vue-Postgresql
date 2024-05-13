import Polyline from "./Polyline";
import Polygon from "./Polygon";
import ArrowDraw from "@/api/cesiumApi/ArrowDraw";

let cesiumDrawInit = {
    lineLength: 0,
    // 一些初始化的操作
    init(viewer,ws) {
        this.viewer = viewer
        this.initDrawEdit(ws);
    },
    initDrawEdit(ws) {
        this.Polyline = new Polyline(this.viewer,ws);
        // this.lineLength = this.Polyline.lineLength
        this.Polygon = new Polygon(this.viewer,ws);
        this.arrowDraw = new ArrowDraw(this.viewer)
    },
    //激活绘制线工具
    drawActivatePolyline() {
        this.Polyline.activate();
    },
    //激活绘制面工具
    drawActivatePolygon() {
        this.Polygon.activate()
    },
    // 判断点是否在polygon内
    isPointInPolygon(polygonPositions, point){
        return this.Polygon.isPointInPolygon(polygonPositions, point)
    },
    // 返回画线时的状态，0:未激活 1:绘制，不加这个条件会触发this.showPolyline,导致删除线按钮一直出现
    drawPolylineStatus() {
        return this.Polyline.status
    },
    arrowD(tp){
      this.arrowDraw.init(this.viewer)
      this.arrowDraw.draw(tp)
    }
}
export default cesiumDrawInit;
