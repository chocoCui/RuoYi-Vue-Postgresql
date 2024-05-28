import Cesium from "cesium";

export default class CesiumScreenSpaceEventHandler{
  constructor() {
    
  }
  // 点击场景中实体会出现弹窗的事件处理器
  entitiesClickPonpHandler() {
    let that = this
    window.viewer.screenSpaceEventHandler.setInputAction(async (click) => {
      // 1-1 获取点击点的信息（包括）
      let pickedEntity = window.viewer.scene.pick(click.position);
      window.selectedEntity = pickedEntity?.id
      // 2-1 判断点击物体是否为点实体（billboard）
      if (Cesium.defined(pickedEntity) && window.selectedEntity !== undefined && window.selectedEntity._billboard !== undefined) {
        // const cesiumPosition = that.selectedEntity.position.getValue(
        //     window.viewer.clock.currentTime
        // );
        //
        // 2-2 获取点击点的经纬度
        let ray = viewer.camera.getPickRay(click.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // 2-3 将笛卡尔坐标转换为地理坐标角度,再将地理坐标角度换为弧度
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);

        // 2-4-1 将经纬度和高度生成新的笛卡尔坐标，用来解决弹窗偏移（不加载地形的情况）
        let height = 0
        that.selectedEntityHighDiy = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);// 这种可以存data吗？？？？？？？？？？？？？？？
        // 2-4-2 加载地形时，构建虚拟的已添加实体，让弹窗定位到虚拟的实体上
        if (this.isTerrainLoaded()) {
          const cesiumPosition = window.selectedEntity.position.getValue(window.viewer.clock.currentTime);//获取时间？？？？？？？？？？？？
          let l = Cesium.Cartographic.fromCartesian(position)
          let lon = Cesium.Math.toDegrees(l.longitude)
          let lat = Cesium.Math.toDegrees(l.latitude)
          let hei = l.height
          let height
          // 将笛卡尔坐标转换为地理坐标角度
          let cartographic = Cesium.Cartographic.fromCartesian(position);
          // 将地理坐标角度换为弧度
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          height = window.viewer.scene.globe.getHeight(cartographic) // 获取当前位置的高度
          // 将经纬度和高度生成新的笛卡尔坐标
          that.selectedEntityHighDiy = Cesium.Cartesian3.fromDegrees(Number(longitude.toFixed(6)), Number(latitude.toFixed(6)), height);
          // console.log("虚拟位置",{longitude, latitude, height},"真实位置",{lon,lat,hei})
        }
        // 2-5 更新弹窗位置
        // that.selectedEntity = window.selectedEntity
        that.popupData = {
          type: window.selectedEntity.properties.type.getValue(),
          time: window.selectedEntity.properties.time.getValue(),
          name: window.selectedEntity.properties.name.getValue(),
          lon: window.selectedEntity.properties.lon.getValue(),
          lat: window.selectedEntity.properties.lat.getValue(),
          describe: window.selectedEntity.properties.describe.getValue(),
        };
        this.popupVisible = true; // 显示弹窗
        this.updatePopupPosition(); // 更新弹窗的位置

      } else {
        this.popupVisible = false; // 隐藏弹窗
      }
      // 3-1 选中面时触发
      if (Cesium.defined(pickedEntity) && window.selectedEntity._polygon !== undefined) {
        that.showPolygon = true
        // that.polygonPosition = window.selectedEntity
      } else {
        this.showPolygon = false
      }
      // 4-1选中线时触发
      if (Cesium.defined(pickedEntity) && window.selectedEntity._polyline !== undefined) {
        let status = cesiumDrawInit.drawPolylineStatus()
        if (status === 0) {
          that.showPolyline = true
          // that.polylinePosition = window.selectedEntity
        }
      } else {
        this.showPolyline = false
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK); //LEFT_DOUBLE_CLICK

    // 必须有这个，拖动地图弹窗位置才会跟着移动
    window.viewer.screenSpaceEventHandler.setInputAction(movement => {
      if (that.popupVisible && window.selectedEntity) {
        that.updatePopupPosition(); // 更新弹窗的位置
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
}
