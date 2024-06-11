import * as Cesium from 'cesium'

let webSocket

export function initWebSocket() {
  const currentTime = Date.now();
  const wsuri = "ws://192.168.3.18:8080/ws/" + currentTime;
  if (typeof (WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket");
  } else {
    webSocket = new WebSocket(wsuri);
    webSocket.onmessage = websocketonmessage;
    webSocket.onopen = websocketonopen;
    webSocket.onerror = websocketonerror;
    webSocket.onclose = websocketclose;
    webSocket.eqid = ''
  }
  return webSocket
}

//连接建立之后执行send方法发送数据
function websocketonopen() {
  let actions = {"test": "我已在线"};
  console.log(this.eqid,this)
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
    // console.log(this.eqid,1)
    // console.log(JSON.parse(e.data).data.eqid,1)

      let markType = JSON.parse(e.data).type
      let markOperate = JSON.parse(e.data).operate // 标绘的（add、delete）
      if(markOperate==="add"){
        if(this.eqid===JSON.parse(e.data).data.eqid) {
          let markData = JSON.parse(e.data).data
          wsAdd(markType, markData)
        }
      }
      else if(markOperate === "delete"){
        let id = JSON.parse(e.data).id
        if(markType === "point"){
          window.viewer.entities.removeById(id)
        }
        else if(markType === "polyline"){
          let polyline = window.viewer.entities.getById(id)
          console.log(id,polyline,window.viewer.entities,123)
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
        width: 50,//图片宽度,单位px
        height: 50,//图片高度，单位px // 会影响data大小，离谱
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
    console.log(data)
    let pointLinePoints = []
    for(let i=0;i<data.positions.length;i++){
      let p = window.viewer.entities.add({
        show: false,
        position: data.positions[i],
        id: data.id + 'point' + (i+1),
        point: {
          pixelSize: 1,
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
    let material = getMaterial(data.type,data.img)
    window.viewer.entities.add({
      id: data.id, //+ 'polyline',
      polyline:{
        positions: data.positions,
        width: 5,
        material: material,
        // material: Cesium.Color.YELLOW,
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
        show: false,
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

// 选择当前线的material
function getMaterial(type,img) {
  if(type==="量算"){
    let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.CYAN,
      dashPattern: parseInt("110000001111", 1),
    })
    return NORMALLINE
  }
  if(type==="地裂缝"||type==="可用供水管网"||type==="不可用供水管网"){
    let PICTURELINE = new Cesium.ImageMaterialProperty({
      image: img,
      repeat: new Cesium.Cartesian2(3, 1),
    })
    return PICTURELINE
  }
  if(type==="可通行公路"||type==="限制通行公路"||type==="不可通行公路"){
    let color = null
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
    return NORMALLINE
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
}
