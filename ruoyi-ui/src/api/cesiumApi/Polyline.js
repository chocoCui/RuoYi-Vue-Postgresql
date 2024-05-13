import * as Cesium from 'cesium'

export default class Polyline {
  constructor(viewer,ws) {
    this.viewer = viewer;
    this.index = 0
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.lineLength = 0;
    this.pointLinePoint = []
    this.status = 0;// 0:未激活 1:绘制
    this.drawEntity = undefined;
    this.positions = [];
    this.tempPositions = [];
    this.initId = null
    this.ws = ws
  }
  //激活
  activate() {
    this.status = 1
    this.positions = [];
    this.tempPositions = [];
    this.deactivate();
    this.clear();
    // 创建Date对象
    let currentDate = new Date();
    // 获取当前时间的时间戳作为ID
    this.initId = currentDate.getTime();
    this.registerEvents(); //注册鼠标事件
  }
  //禁用
  deactivate() {
    this.unRegisterEvents();
    this.drawEntity = undefined;
  }
  //解除鼠标事件
  unRegisterEvents() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  //清空绘制
  clear() {
    if (this.drawEntity) {
      this.viewer.entities.remove(this.drawEntity);
      this.drawEntity = undefined;
    }
  }
  // 注册事件
  registerEvents() {
    this.leftClickEvent();
    this.rightClickEvent();
    this.mouseMoveEvent();
  }
  leftClickEvent() {
    let that = this
    this.handler.setInputAction(e => {
      // let position = this.viewer.scene.pickPosition(e.position);
      let ray = window.viewer.camera.getPickRay(e.position)
      let position = viewer.scene.globe.pick(ray, window.viewer.scene)
      that.index++
      that.positions.push(position);
      let p = that.createPoint(position)
      that.pointLinePoint.push(p)
      if (that.positions.length === 1) {
        that.generatePolyline();
      }
      let distance = that.getSpaceDistance(that.positions)
      document.getElementById("distanceLine").innerHTML = distance.toFixed(2)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  rightClickEvent() {
    let that = this
    this.handler.setInputAction(e => {
      if (!that.drawEntity) {
        that.deactivate()
        return;
      }
      let tempPositions = that.tempPositions.slice(0, that.positions.length)
      that.drawEntity.polyline.positions = new Cesium.CallbackProperty(e => {
        return tempPositions;
      }, false)
      //两点成线
      that.minPositionCount = 2;
      if (that.positions.length < that.minPositionCount) {
        that.clear();
        that.deactivate();
        return;
      }
      that.index = 0
      that.drawEnd();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  mouseMoveEvent() {
    let that = this
    this.handler.setInputAction(e => {
      // that.viewer._element.style.cursor = 'default'; //由于鼠标移动时 Cesium会默认将鼠标样式修改为手柄 所以移动时手动设置回来
      // let position = this.viewer.scene.pickPosition(e.endPosition);
      let ray = window.viewer.camera.getPickRay(e.endPosition)
      let position = viewer.scene.globe.pick(ray, window.viewer.scene)
      if (!that.drawEntity) return;
      that.tempPositions = that.positions.concat([position]);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  //绘制结束 触发结束事件
  drawEnd() {
    let that = this
    console.log(window.viewer.entities)
    this.ws.send(JSON.stringify({
      type:"polyline",
      operate:"add",
      data:{
        id:that.initId,
        positions:that.positions
      }
    }))
    this.status = 0
    this.pointLinePoint = []
    this.drawEntity.remove = () => {
      this.viewer.entities.remove(this.drawEntity);
    }
    this.deactivate();
  }

  createPoint(position) {
    let that = this
    this.lineLength = this.getSpaceDistance(this.positions)
    return this.viewer.entities.add({
      position: position,
      id: that.initId + "point" + that.index,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineWidth: 2,
        outlineColor: Cesium.Color.DARKRED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
        depthTest: false,//禁止深度测试但是没有下面那句有用
        disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
      },
      // show: true
    });
  }
  generatePolyline() {
    let that = this
    this.drawEntity = this.viewer.entities.add({
      id: this.initId + 'polyline',
      polyline: {
        positions: new Cesium.CallbackProperty(e => {
          return this.tempPositions;
        }, false),
        width: 5,
        material: Cesium.Color.YELLOW,
        depthFailMaterial: Cesium.Color.YELLOW,
        clampToGround: true,
      },
      properties: {
        pointPosition: that.pointLinePoint,
      }
    })
  }

  /* 空间两点距离计算函数 */
  getSpaceDistance(positions) {
    let lengthAll = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      // 1.将起点与终点位置信息从笛卡尔坐标形式转换为Cartographic形式
      const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
      // 2.设置测地线起点和终点，EllipsoidGeodesic中setEndPoints常与surfaceDistance搭配使用
      const geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      // 3. 得到空间中点投影到地球表面的曲面距离
      let s = geodesic.surfaceDistance; // surfaceDistance返回number 单位为m，带小数
      // 4. 考虑两点的高度 利用直角三角形求斜边来求实际距离
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
      // 5.每段距离求和
      lengthAll += s
    }
    return lengthAll
  }

}
