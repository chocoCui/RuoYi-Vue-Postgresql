import * as Cesium from "cesium";
import point from '@/assets/point.png'
import Algorithm from './algorithm'

export class StraightArrow{
  constructor(viewer) {
    this.type = "StraightArrow";
    this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0)); //用于区分多个相同箭头时
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.pointImageUrl = point;
    this.fillMaterial = Cesium.Color.fromCssColorString('#0000FF').withAlpha(0.8);
    this.outlineMaterial = new Cesium.PolylineDashMaterialProperty({
      dashLength: 16,
      color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
    });
    this.positions = [];
    this.firstPoint = null;
    this.floatPoint = null;
    this.arrowEntity = null;
    this.state = -1; //state用于区分当前的状态 0 为删除 1为添加 2为编辑
    this.selectPoint = null;
    this.clickStep = 0;
    this.modifyHandler = null;
  //  -----------------------
    this.algorithm = new Algorithm()
  }
  disable() {
    this.positions = [];
    if (this.firstPoint) {
      this.viewer.entities.remove(this.firstPoint);
      this.firstPoint = null;
    }
    if (this.floatPoint) {
      this.viewer.entities.remove(this.floatPoint);
      this.floatPoint = null;
    }
    if (this.arrowEntity) {
      this.viewer.entities.remove(this.arrowEntity);
      this.arrowEntity = null;
    }
    this.state = -1;
    if (this.handler) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.selectPoint) {
      this.viewer.entities.remove(this.selectPoint);
      this.selectPoint = null;
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
    this.clickStep = 0;
  }
  disableHandler(){
    console.log(this.handler)
    if (this.handler) {
      // this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
  }
  startDraw() {
    let that = this;
    this.state = 1;
    this.handler.setInputAction(function(evt) { //单机开始绘制
      let cartesian;
      cartesian = getCatesian3FromPX(evt.position, that.viewer);
      if (!cartesian) return;
      if (that.positions.length === 0) {
        that.firstPoint = that.creatPoint(cartesian);
        that.firstPoint.type = "firstPoint";
        that.floatPoint = that.creatPoint(cartesian);
        that.floatPoint.type = "floatPoint";
        that.positions.push(cartesian);
      }
      if (that.positions.length === 3) {
        that.firstPoint.show = false;
        that.floatPoint.show = false;
        that.handler.destroy();
        that.arrowEntity.objId = that.objId;
        that.state = -1;
      }
      that.positions.push(cartesian.clone());
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction(function(evt) { //移动时绘制面
      if (that.positions.length < 1) return;
      let cartesian;
      cartesian = getCatesian3FromPX(evt.endPosition, that.viewer);
      if (!cartesian) return;

      that.floatPoint.position.setValue(cartesian);
      if (that.positions.length >= 2) {
        if (!Cesium.defined(that.arrowEntity)) {
          that.positions.push(cartesian);
          that.arrowEntity = that.showArrowOnMap(that.positions);
        } else {
          that.positions.pop();
          that.positions.push(cartesian);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  startModify() { //修改箭头
    this.state = 2;
    this.firstPoint.show = true;
    this.floatPoint.show = true;
    let that = this;
    this.clickStep = 0;
    if (!this.modifyHandler) this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.modifyHandler.setInputAction(function(evt) { //单机开始绘制
      let pick = that.viewer.scene.pick(evt.position);
      if (Cesium.defined(pick) && pick.id) {
        that.clickStep++;
        if (!pick.id.objId)
          that.selectPoint = pick.id;
      } else { //激活移动点之后 单机面之外 移除这个事件
        that.modifyHandler.destroy();
        that.modifyHandler = null;
        that.firstPoint.show = false;
        that.floatPoint.show = false;
        that.state = -1;
      }
      //选中点后 第二次点击 则重新定位该点
      if (that.clickStep === 2) {
        that.clickStep = 0;
        let cartesian;
        cartesian = getCatesian3FromPX(evt.position, that.viewer);
        if (!cartesian) return;
        if (that.selectPoint) {
          that.selectPoint.position.setValue(cartesian);
          that.selectPoint = null;
        }
      };
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.modifyHandler.setInputAction(function(evt) {
      if (that.selectPoint) {
        let cartesian;
        cartesian = getCatesian3FromPX(evt.endPosition, that.viewer);
        if (!cartesian) return;
        that.selectPoint.position.setValue(cartesian);
        if (that.selectPoint.type === "firstPoint") {
          that.positions[1] = cartesian;
        }
        if (that.selectPoint.type === "floatPoint") {
          that.positions[2] = cartesian;
        }
      } else {
        return;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  createByData(data) { //通过传入的经纬度数组 构建箭头
    this.state = -1;
    this.positions = [];
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let cart3 = Cesium.Cartesian3.fromDegrees(data[i][0], data[i][1]);
      arr.push(cart3);
    }
    this.positions = arr;
    this.firstPoint = this.creatPoint(this.positions[1]);
    this.firstPoint.type = "firstPoint";
    this.floatPoint = this.creatPoint(this.positions[2]);
    this.floatPoint.type = "floatPoint";
    this.arrowEntity = this.showArrowOnMap(this.positions);
    this.firstPoint.show = false;
    this.floatPoint.show = false;
    this.arrowEntity.objId = this.objId;
  }
  clear() { //清除绘制箭头
    this.state = 0;
    if (this.firstPoint) this.viewer.entities.remove(this.firstPoint);
    if (this.floatPoint) this.viewer.entities.remove(this.floatPoint);
    if (this.arrowEntity) this.viewer.entities.remove(this.arrowEntity);
    this.state = -1;
  }
  getLnglats() {
    let arr = [];
    for(let i = 0; i < this.positions.length; i++) {
      let item = this.cartesianToLatlng(this.positions[i]);
      arr.push(item);
    }
    return arr;
  }
  getPositions() { //获取直角箭头中的关键点
    return this.positions;
  }
  creatPoint(cartesian) {
    let point = this.viewer.entities.add({
      position: cartesian,
      billboard: {
        image: this.pointImageUrl,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
    point.attr = "editPoint";
    return point;
  }
  showArrowOnMap(positions) {
    let that = this;
    let update = function() {
      if (positions.length < 2) {
        return null;
      }
      let p1 = positions[1];
      let p2 = positions[2];
      let firstPoint = that.cartesianToLatlng(p1);
      let endPoints = that.cartesianToLatlng(p2);
      let arrow = [];
      let res = that.algorithm.fineArrow([firstPoint[0], firstPoint[1]], [endPoints[0], endPoints[1]]);
      let index = JSON.stringify(res).indexOf("null");
      if (index !== -1) return [];
      for (let i = 0; i < res.length; i++) {
        let c3 = new Cesium.Cartesian3(res[i].x, res[i].y, res[i].z);
        arrow.push(c3);
      }
      return new Cesium.PolygonHierarchy(arrow);
    }
    return this.viewer.entities.add({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(update, false),
        show: true,
        fill: true,
        material: that.fillMaterial
      })
    });
  }
  cartesianToLatlng(cartesian) {
    let latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    let lat = Cesium.Math.toDegrees(latlng.latitude);
    let lng = Cesium.Math.toDegrees(latlng.longitude);
    return [lng, lat];
  }

}
export class AttackArrow{

}
export class PincerArrow{

}
function getCatesian3FromPX(px, viewer) {
  let picks = viewer.scene.drillPick(px);
  viewer.render();
  let cartesian;
  let isOn3dtiles = true;
  for (let i = 0; i < picks.length; i++) {
    if ((picks[i] && picks[i].primitive) || picks[i] instanceof Cesium.Cesium3DTileFeature) { //模型上拾取
      isOn3dtiles = true;
    }
  }
  if (isOn3dtiles) {
    // console.log(px,viewer.scene,123)
    // cartesian = viewer.scene.pickPosition(px);
    let ray = viewer.camera.getPickRay(px);
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  } else {
    let ray = viewer.camera.getPickRay(px);
    if (!ray) return null;
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  }
  return cartesian;
}
