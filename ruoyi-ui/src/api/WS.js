import * as Cesium from 'cesium'

let webSocket

export function initWebSocket() {
  const currentTime = Date.now();
  const wsuri = "ws://localhost:8080/ws/" + currentTime;
  if (typeof (WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    webSocket = new WebSocket(wsuri);
    webSocket.onmessage = websocketonmessage;
    webSocket.onopen = websocketonopen;
    webSocket.onerror = websocketonerror;
    webSocket.onclose = websocketclose;
  }
  return webSocket
}

//连接建立之后执行send方法发送数据
function websocketonopen() {
  let actions = {"test": "我已在线"};
  webSocket.send(JSON.stringify(actions));
  // websocketsend(JSON.stringify(actions));
}

//连接建立失败重连
function websocketonerror() {
  initWebSocket();
}

//关闭
function websocketclose(e) {
  console.log('断开连接', e);
}

function websocketonmessage(e){
  // this.$modal.msg(e.data);
  try {
    let markType = JSON.parse(e.data).type
    let markOperate = JSON.parse(e.data).operate // 标绘的（add、delete）
    if(markOperate==="add"){
      let markData = JSON.parse(e.data).data
      wsAdd(markType,markData)
    }
    else if(markOperate === "delete"){
      let id = JSON.parse(e.data).id
      if(markType === "point"){
        window.viewer.entities.removeById(id)
      }
      else if(markType === "polyline"){
        let polyline = window.viewer.entities.getById(id)
        let polylinePosition = polyline.properties.getValue(Cesium.JulianDate.now())//用getvalue时添加时间是不是用来当日志的？
        polylinePosition.pointPosition.forEach((item, index) => {
          window.viewer.entities.remove(item)
        })
        window.viewer.entities.remove(polyline)
      }
      else if(markType === "polygon"){
        let polygon = window.viewer.entities.getById(id)
        let polygonPosition = polygon.properties.getValue(Cesium.JulianDate.now())//用getvalue时添加时间是不是用来当日志的？
        polygonPosition.linePoint.forEach((item, index) => {
          console.log(item)
          window.viewer.entities.remove(item)
        })
        window.viewer.entities.remove(polygon)
      }
    }
  } catch (err){
    console.log(err,'error错咯');
  }
}
function wsAdd(type,data){
  if(type==="point"){
    window.viewer.entities.add({
      id:data.id,
      position: Cesium.Cartesian3.fromDegrees(Number(data.lon) , Number(data.lat), Number(data.height)),
      billboard: {
        image: data.img,
        // width: 200,//图片宽度,单位px
        // height: 200,//图片高度，单位px // 会影响data大小，离谱
        eyeOffset: new Cesium.Cartesian3(0, 0, 0),//与坐标位置的偏移距离
        color: Cesium.Color.WHITE.withAlpha(1),//颜色
        scale: 0.8,//缩放比例
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
        depthTest: false,//禁止深度测试但是没有下面那句有用
        disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
      },
      properties:{
        type:data.type,
        lon:data.lon,
        lat:data.lat,
        height:data.height,
        id:data.id,
        img:data.img,
        time:data.time,
        name:data.name,
        describe:data.describe,
      }
    })
  }
  else if(type==="polyline"){
    let pointLinePoints = []
    for(let i=0;i<data.positions.length;i++){
      let p = window.viewer.entities.add({
        position: data.positions[i],
        id: data.id + 'point' + (i+1),
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED,
          outlineWidth: 2,
          outlineColor: Cesium.Color.DARKRED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
      });
      pointLinePoints.push(p)
    }
    window.viewer.entities.add({
      id: data.id + 'polyline',
      polyline:{
        positions: data.positions,
        width: 5,
        material: Cesium.Color.YELLOW,
        depthFailMaterial: Cesium.Color.YELLOW,
        clampToGround: true,
      },
      properties: {
        pointPosition: pointLinePoints,
      }
    })
  }
  else if(type === "polygon"){
    let pointLinePoints = []
    for(let i=0;i<data.positions.length;i++){
      let p = window.viewer.entities.add({
        id: data.id + 'Point' + (i+1),
        position: data.positions[i],
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,},
      });
      pointLinePoints.push(p)
    }
    window.viewer.entities.add({
      id: data.id,
      polygon: {
        hierarchy: data.positions,
        material:new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
        clampToGround: true,
      },
      properties: {
        pointPosition: data.positions,
        linePoint: pointLinePoints,
      }
    })
  }
}
