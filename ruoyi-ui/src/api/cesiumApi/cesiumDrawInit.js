import Polyline from "./Polyline";
import Polygon from "./Polygon";

let cesiumDrawInit = {
    lineLength: 0,
    // 一些初始化的操作
    init(viewer) {
        this.viewer = viewer
        this.initDrawEdit();
    },
    initDrawEdit() {
        this.Polyline = new Polyline(this.viewer);
        // this.lineLength = this.Polyline.lineLength
        this.Polygon = new Polygon(this.viewer);
    },
    //激活绘制线工具
    drawActivatePolyline(type) { //type in Point Polyline Polygon
        this.Polyline.activate(type);
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

}
export default cesiumDrawInit;
