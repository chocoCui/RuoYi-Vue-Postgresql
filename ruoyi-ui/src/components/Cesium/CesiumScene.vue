<template>
  <div id="cesiumContainer" >
    <el-form class="tool-container">
      <el-row>
        <div class="modelAdj">模型调整</div>
        <el-button class="el-button--primary" @click="find">找到模型</el-button>
        <el-button class="el-button--primary" @click="showArrow">{{ showArrowText }}</el-button>
<!--        <el-button class="el-button&#45;&#45;primary" @click="isTerrainLoaded">地形是否加载</el-button>-->
        <el-button class="el-button--primary" @click="hide">{{ modelStatusContent }}</el-button>
      </el-row>
      <el-row>
        <br>
        <span style="color: white">调整高度</span>
        <el-slider
            v-model="tz"
            show-input
            :max="2000"
            :min="-2000"
            :step="10"
            @change="changeHeight(tz)"
        >
        </el-slider>
      </el-row>
      <el-row>
        <br>
        <p style="color: white">绕Z轴旋转模型</p>
        <el-slider
            v-model="rz"
            show-input
            :max="180"
            :min="-180"
            :step="1"
            @change="changeRotationZ(rz)"
        >
        </el-slider>
      </el-row>
      <el-row>
        <br>
        <span style="color: white">调整模型透明度</span>
        <el-slider
            v-model="opacity"
            show-input
            :max="100"
            :min="0"
            :step="1"
            @change="changeOpacity(opacity)"
        >
        </el-slider>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span style="color: white">经度：<span id="longitudeShow"></span>°</span>
        </el-col>
        <el-col :span="8">
          <span style="color: white">纬度：<span id="latitudeShow"></span>°</span>
        </el-col>
        <el-col :span="8">
          <span style="color: white">视角高：<span id="altitudeShow"></span>km</span>
        </el-col>
      </el-row>
    </el-form>
    <el-form class="button-container">
      <div class="modelAdj">模型选择</div>
      <el-button class="el-button--primary" @click="selectModel(1)">0.4平方公里模型</el-button>
      <el-button class="el-button--primary" @click="selectModel(2)">7.37平方公里模型</el-button>
      <!--      <el-button class="el-button&#45;&#45;primary" @click="selectModel(3)">3</el-button>-->
      <!--      <el-button class="el-button&#45;&#45;primary" @click="selectModel('mianyang_235GB_8km2_3dtiles/shang')">绵阳上-->
      <!--      </el-button>-->
      <!--      <el-button class="el-button&#45;&#45;primary" @click="selectModel('mianyang_235GB_8km2_3dtiles/xia')">绵阳下</el-button>-->
      <!--      <el-button class="el-button&#45;&#45;primary" @click="selectModel('tianquan_37.6GB_4km2_3dtiles')">天全</el-button>-->
      <!--      <el-button class="el-button&#45;&#45;primary" @click="selectGltfModel()">gltf</el-button>-->
      <el-button class="el-button--primary" @click="home">雅安</el-button>

    </el-form>
    <!---------简单标绘功能------>
    <el-form class="noteContainer">
      <div class="modelAdj">标绘工具</div>
      <el-row>
        <el-button class="el-button--primary" @click="showMarkCollection=!showMarkCollection">添加标注信息</el-button>
        <el-button class="el-button--primary" @click="drawP">量算面积</el-button>
        <el-button class="el-button--primary" @click="drawN">量算距离</el-button>
        <el-button type="danger" class="el-button--primary" @click="deletePolygon" v-if="this.showPolygon">删除面
        </el-button>
        <el-button type="danger" class="el-button--primary" @click="deletePolyline" v-if="this.showPolyline">删除线
        </el-button>
      </el-row>
      <el-row>
        <br>
        <el-col :span="12">
          <span style="color: white;">距离：</span>
          <span style="color: white;" id="distanceLine">0</span>
          <span style="color: white;"> 米</span>
        </el-col>
        <el-col :span="12">
          <span style="color: white;">面积：</span>
          <span style="color: white;" id="area">0</span>
          <span style="color: white;"> 平方米</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="color: white;">区域内标绘个数：</span>
          <span style="color: white;" id="ispointIcon">0 </span>
          <span style="color: white;"> 个</span>
        </el-col>
      </el-row>
    </el-form>
    <div class="markCollection" v-show="showMarkCollection">
      <span v-for="(item,index) in typeList" @click="openAddMark(item.label)">
        <img :src="item.img" width="30px" height="30px"></img>
      </span>
    </div>
    <addMarkCollectionDialog :addMarkDialogFormVisible.sync="addMarkDialogFormVisible" :addMarkForm.sync="addMarkForm"
                             @clearMarkDialogForm="resetAddMarkCollection" @wsSend="websocketsend"/>
    <commonPanel :visible="popupVisible" :position="popupPosition" :popupData="popupData" @delete="deleteMark"/>
    <!-------------------------->
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'
import {initCesium} from '@/api/cesiumApi/initCesium'
import CesiumNavigation from "cesium-navigation-es6";
import {Message} from 'element-ui'
import {modelMatrix} from "cesium";
import addMarkCollectionDialog from "@/components/Cesium/addMarkCollectionDialog"
import commonPanel from "@/components/Cesium/CommonPanel";
import cesiumDrawInit from "@/api/cesiumApi/cesiumDrawInit";
import {markPhotoList, matchMark, refenceMarkPhotoList} from "@/api/cesiumApi/tool"

export default {
  components: {
    addMarkCollectionDialog, commonPanel
  },
  data: function () {
    return {
      tz: 0,
      rz: 0,
      originRz: 0,
      originTz: 0,
      opacity: 100,
      showArrowValue: false,
      showArrowText: "显示坐标轴",
      //-----------标绘部分--------------
      typeList: null,// 点标注控件根据此数据生成
      refenceTypeList: null,//用来对照弹窗中类型的中文
      showMarkCollection: false, // 点标绘控件的显示和隐藏
      openAddStatus: true, // 用来控制添加billboard按钮的状态，点一次后只有添加完点才能再点击
      message: null, // 添加点标绘的时候的弹窗相关
      addMarkDialogFormVisible: false, // 标绘信息填写对话框的显示和隐藏
      addMarkForm: { // 标绘信息填写数据
        type: null,
        time: null,
        name: null,
        lon: null,
        lat: null,
        height: null,
        describe: null,
        img: null
      },
      //-----------弹窗部分--------------
      selectedEntityHighDiy: null,
      popupPosition: {x: 0, y: 0}, // 弹窗显示位置，传值给子组件
      popupVisible: false, // 弹窗的显示与隐藏，传值给子组件
      popupData: {}, // 弹窗内容，传值给子组件
      //--------------------------------------------------
      showPolygon: false, // y面的删除按钮
      showPolyline: false,// 线的删除按钮
      // ---------------------------------------------------
      modelStatus: true,
      modelStatusContent: "隐藏当前模型",
      modelName:""
      //
    };
  },
  mounted() {
    let viewer = initCesium(Cesium)
    viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
    window.viewer = viewer
    let options = {}
// 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Cartographic.fromDegrees(103.00, 29.98, 1500, new Cesium.Cartographic)
// 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true
// 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true
// 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true
// 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true
    options.resetTooltip = "重置视图";
    options.zoomInTooltip = "放大";
    options.zoomOutTooltip = "缩小";


//新版必须new  CesiumNavigation ,可以查看作者github
    window.navigation = new CesiumNavigation(viewer, options)
    // document.getElementsByClassName('navigation-control-icon-zoom-in')[0].style.color = '#409EFF'
    // document.getElementsByClassName('navigation-control-icon-zoom-out')[0].style.color = '#409EFF'
    document.getElementsByClassName('cesium-geocoder-input')[0].placeholder = '请输入地名进行搜索'
    document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[0].innerHTML = '影像服务'
    document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[1].innerHTML = '地形服务'
    // document.getElementsByClassName('cesium-viewer-cesiumInspectorContainer')[0].style.top = '300px'
    // document.getElementsByClassName('cesium-viewer-cesium3DTilesInspectorContainer')[0].style.top = '600px'


    // 设置鼠标位置经纬度\视角高度实时显示
    let longitudeShow = document.getElementById('longitudeShow');
    let latitudeShow = document.getElementById('latitudeShow');
    let altitudeShow = document.getElementById('altitudeShow');
    let canvas = viewer.scene.canvas;
    //具体事件的实现
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function (movement) {
      //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
      let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
      if (cartesian) {
        //将笛卡尔三维坐标转为地图坐标（弧度）
        let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        //将地图坐标（弧度）转为十进制的度数
        let latString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        let logString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        // 获取相机的海拔高度作为视角高度/km
        let altiString = (viewer.camera.positionCartographic.height / 1000).toFixed(2);
        longitudeShow.innerHTML = logString;
        latitudeShow.innerHTML = latString;
        altitudeShow.innerHTML = altiString;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // 生成实体点击事件的handler
    this.entitiesClickPonpHandler()
    this.watchTerrainProviderChanged()
    this.createMarkPhoteList()
    cesiumDrawInit.init(window.viewer);
    // window.modelList = {}
    this.initWebSocket()
  },
  methods: {
    initWebSocket(){
      const wsuri = "ws://localhost:8080/ws/123214";
      if(typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      }else{
        console.log(wsuri)
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      }
    },
    //连接建立之后执行send方法发送数据
    websocketonopen(){
      let actions = {"test":"我已在线"};
      this.websocketsend(JSON.stringify(actions));
    },
    //连接建立失败重连
    websocketonerror(){
      this.initWebSocket();
    },
    //数据接收
    websocketonmessage(e){
      // this.$modal.msg(e.data);
      try {
        let markType = JSON.parse(e.data).type // 标绘的类型（add、delete）
        let markData = JSON.parse(e.data).data
        if(markType==="add"){
          // console.log("add",markData)
          this.wsAddMark(markData)
        }else if(markType === "delete"){
          console.log("delete")
        }
      } catch (err){
        console.log(e.data);
      }
    },
    //数据发送
    websocketsend(Data){
      this.websock.send(Data);
    },
    //关闭
    websocketclose(e){
      console.log('断开连接',e);
    },
    wsAddMark(data){
      window.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(Number(data.lon) , Number(data.lat), Number(data.height)),
        billboard: {
          image: data.img,
          // width: 200,//图片宽度,单位px
          // height: 200,//图片高度，单位px // 会影响point大小，离谱
          eyeOffset: new Cesium.Cartesian3(0, 0, 0),//与坐标位置的偏移距离
          color: Cesium.Color.WHITE.withAlpha(1),//颜色
          scale: 0.8,//缩放比例
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
        properties:{
          type:data.type,
          time:data.time,
          name:data.name,
          lon:data.lon,
          lat:data.lat,
          describe:data.describe,
        }
      })
    },
    // ------------------------------
    isTerrainLoaded() {
      let terrainProvider = window.viewer.terrainProvider;
      if (terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
        // console.log("地形未加载")
        return false;
      } else if (Cesium.defined(terrainProvider)) {
        // 如果terrainProvider已定义，但不是EllipsoidTerrainProvider，
        // 则表示已经设置了其他地形提供者
        // console.log("地形已加载")
        return true;
      }
      // console.log("地形未加载")
      return false;
    },
    // cesium自身接口scene.terrainProviderChanged(只读),当地形发生变化时(添加高程)触发
    // 不能用watch来监视scene.terrainProviderChanged,会造成堆栈溢出（内存溢出）
    watchTerrainProviderChanged() {
      let that = this
      window.viewer.scene.terrainProviderChanged.addEventListener(terrainProvider => {
        this.popupVisible = false // 地形改变时关闭弹窗
        let tzs = []
        if(that.modelName === 1){
          tzs[0] = 9
          tzs[1] = -567
        }else {
          tzs[0] = 15
          tzs[1] = -557
        }
        if(that.isTerrainLoaded()){
          that.changeHeight(tzs[0])
          that.tz = tzs[0]
          that.find()
        }else {
          that.changeHeight(tzs[1])
          that.tz = tzs[1]
          that.find()
        }
      });
    },
    //创建点标注控件需要的数据
    createMarkPhoteList() {
      this.typeList = markPhotoList()
      this.refenceTypeList = refenceMarkPhotoList()
    },
    // 所有entity实体类型点击事件的handler（billboard、polyline、polygon）
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
    },
    //--------------billboard标绘------------------------
    // 添加billboard点标注
    openAddMark(type) {
      if (this.openAddStatus) {
        // 1-1 更改添加点标注按钮状态
        this.changeOpenAddStatus()
        // 2-1 保存点标注的类型
        this.addMarkForm.type = type
        // 3-1 提示弹窗
        this.message = Message({
          message: '请点击地图添加标注点',
          type: 'info',
          duration: 0
        })
        // 4-1 生成点标注的handler
        this.initMarkHandlder(window.viewer)
      }
    },
    // 用来控制添加billboard按钮的状态，点一次后只有添加完点才能再点击
    changeOpenAddStatus() {
      this.openAddStatus = !this.openAddStatus
    },
    // 生成点标注的handler
    initMarkHandlder(viewer) {
      let that = this
      window.noteHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      window.noteHandler.setInputAction((event) => {
        // let Cartesian3Pick = viewer.scene.pickPosition(event.position) //根据event中屏幕坐标获取笛卡尔坐标
        // 1-1获取点击的位置的坐标信息（经度、纬度、高度）
        let ray = viewer.camera.getPickRay(event.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // 1-2坐标系转换
        let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
        let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
        let lat = Cesium.Math.toDegrees((cartographic.latitude))
        let height = cartographic.height
        // 2-1关闭请添加标注的提示并打开弹窗
        that.message.close()
        // 3-1 在addMarkForm中添加经纬度（高度可以不加），点开弹窗中就有经纬度，并且把经纬度图片等信息通过form给子组件
        that.addMarkForm.lat = lat.toFixed(6)
        that.addMarkForm.lon = lon.toFixed(6)
        that.addMarkForm.height = height
        that.addMarkForm.img = that.matchIcon(that.addMarkForm.type)
        that.addMarkForm.type = that.refenceTypeList[that.addMarkForm.type]
        // 4-1打开弹窗
        that.addMarkDialogFormVisible = true // 打开填写信息的弹窗
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 匹配标绘的类型与图标
    matchIcon(type) {
      let list = matchMark() // 封装的marchMark
      return list[type]
    },
    // 重置标绘信息填写的绑定数据
    resetAddMarkCollection() {
      // 1-1 关闭弹窗
      this.addMarkDialogFormVisible = false
      // 2-1 清空form给下一次添加点标绘用
      for (let item in this.addMarkForm) {
        this.addMarkForm[item] = null
      }
      // 3-1 更改添加点标绘按钮状态使其可以点击
      this.changeOpenAddStatus()
    },
    //--------------------弹窗----------------------
    // 判断是否有高程
    // 更新弹窗的位置
    updatePopupPosition() {
      // 笛卡尔3转笛卡尔2（屏幕坐标）
      const canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(window.viewer.scene, this.selectedEntityHighDiy)
      if (canvasPosition) {
        this.popupPosition = {
          x: canvasPosition.x,//+ 20,
          y: canvasPosition.y //- 60 // 假设弹窗应该在图标上方 50px 的位置
        };
      }
    },
    // panel子组件调用此方法删除标注
    deleteMark() {
      viewer.entities.remove(window.selectedEntity);
      this.popupVisible = false
    },
    //------------polyline------------
    // 画线
    drawN() {
      cesiumDrawInit.drawActivatePolyline();
    },
    // 删除线
    deletePolyline() {
      let polyline = window.selectedEntity
      console.log(polyline)
      let polylinePosition = polyline.properties.getValue(Cesium.JulianDate.now())//用getvalue时添加时间是不是用来当日志的？
      polylinePosition.pointPosition.forEach((item, index) => {
        window.viewer.entities.remove(item)
      })
      window.viewer.entities.remove(polyline)
      this.showPolyline = false
    },
    //------------polygon-------------
    // 画面
    drawP() {
      cesiumDrawInit.drawActivatePolygon()
    },
    // 删除面
    deletePolygon() {
      let polygon = window.selectedEntity//this.polygonPosition
      let polygonPosition = polygon.properties.pointPositon.getValue(Cesium.JulianDate.now()) //获取存在Polygon中的顶点坐标
      let posArr = [] // 转换成经纬度数组
      polygonPosition.forEach((item, index) => {
        let cartographicPosition = Cesium.Cartographic.fromCartesian(item)
        posArr[index] = [Cesium.Math.toDegrees(cartographicPosition.longitude), Cesium.Math.toDegrees(cartographicPosition.latitude)]
      })
      let deletePointArr = []
      let points = window.viewer.entities.values // 获取所有实体
      points.forEach((item, i) => {
        if (item._point !== undefined) { // 判断是否是点
          let posCartographicPosition = Cesium.Cartographic.fromCartesian(item.position.getValue(Cesium.JulianDate.now()))//使用getValue时需要加上时间
          let pos = { // 从平面坐标系坐标转经纬度坐标
            lon: Cesium.Math.toDegrees(posCartographicPosition.longitude),
            lat: Cesium.Math.toDegrees(posCartographicPosition.latitude)
          }
          if (cesiumDrawInit.isPointInPolygon(posArr, pos)) { // 添加面的时候为了更显眼顶点处是添加的point，所以删除面的时候要同时删除点，就可以用写好的判断点是否在面里的方法
            deletePointArr.push(item)
          }
        }
      })
      // 不可以直接在上个循环上删除，因为points相当于是所有实体的指针，删除的时候实体数量就变化了，所以需要先存到deletePointArr，再删除
      for (let i = 0; i < deletePointArr.length; i++) {
        window.viewer.entities.remove(deletePointArr[i])
      }
      window.viewer.entities.remove(polygon)
      this.showPolygon = false
    },
    //------------------------------------------------------------------------------
    hide() {
      // this.modelStatus = false
      if (this.modelStatus) {
        window.modelObject.show = false
        this.modelStatus = false
        this.modelStatusContent = '显示当前模型'
      } else {
        window.modelObject.show = true
        this.modelStatus = true
        this.modelStatusContent = '隐藏当前模型'
      }

    },
    //------------------------------------------------------------------------------
    selectGltfModel() {
      this.remove3dData()
      this.tz = 0
      this.originTz = 0

      let cartesian = new Cesium.Cartesian3.fromDegrees(103.00, 29.98, 0.0)
      let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);

      let model = Cesium.Model.fromGltf({
        url: './peilou/万达.gltf',
        modelMatrix: modelMatrix,
        id: 'wanda',
        minimumPixelSize: 128,
        scale: 1,
      })
      window.modelObject = model
      window.viewer.scene.primitives.add(window.modelObject)
      console.log(window.modelObject)
      window.modelObject.readyPromise.then(function () {

        let origin = new Cesium.Cartesian3(0, 0, 1000)
        Cesium.Matrix4.multiplyByPoint(window.modelObject.modelMatrix, origin, origin)
        window.viewer.camera.flyTo({
          destination: origin,
          orientation: {
            // 指向
            heading: 6.283185307179581,
            // 视角
            pitch: -1.5688168484696687,
            roll: 0.0
          }
        });
      })

    },
    selectModel(modelName) {
      this.remove3dData()
      this.initModel(modelName)
      // window.viewer.zoomTo(
      //     window.modelObject
      // )
      window.viewer.flyTo(window.modelObject)
      this.modelStatus = true
      this.modelStatusContent = "隐藏当前模型"
      this.modelName = modelName
      // this.changeHeight(tz)
    },
    /**
     * @Description:初始化加载模型并贴地
     * @author White Mo
     * @date 2024/3/25
     */
    initModel(modelName) {
      let baseURL = process.env.VUE_APP_API_URL
      const that = this
      const tileset = new Cesium.Cesium3DTileset({
        url: baseURL + "/geoserver/www/" + modelName + "/tileset.json",
        loadSiblings: true,
        show: true,
        maximumScreenSpaceError:64,//默认16，值越大经度越小
        maximumMemoryUsage:3000,//可用于缓存瓦片的最大GPU内存量（以MB为单位）
        skipLevelOfDetail:true,
        preferLeaves:true
      });
      // let obj = modelName
      // Object.defineProperty(window.modelList, obj, {value:tileset,writable: true, enumerable: true, configurable: true})

      //如果遇到url中特殊字符+问题，前往node_modules\cesium\Source\ThirdParty\uri.js修改'%2B': '+'为'%2B': '%2B',禁止将json中的%2B转为+，因为geoserver无法识别+路径
      window.modelObject = tileset
      tileset.zIndex = -1;
      tileset.readyPromise.then(function () {
        window.viewer.scene.primitives.add(tileset);
        console.log("模型已加载")

        let tzs
        if(that.modelName === 1){
          tzs = 9
        }else {
          tzs = 15
        }
        if(that.isTerrainLoaded()){
          that.tz = tzs
          that.changeHeight(tzs)
        }else {
          const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);//获取模型高度
          // console.log(Cesium.Math.toDegrees(cartographic.latitude))
          // console.log(Cesium.Math.toDegrees(cartographic.longitude))
          that.tz = 20 - Math.trunc(cartographic.height)//高度取整
          that.transferModel(tileset, 0, 0, that.tz, 0, 0, 0, 1, 1)//模型贴地
        }
      })
    },
    /**
     * @Description: 调用模型更改函数更改高度
     * @author White Mo
     * @date 2024/3/22
     */
    changeHeight(tz) {
      this.transferModel(window.modelObject, 0, 0, tz, this.opacity)
    },

    /**
     * @Description: 调用模型更改函数更改透明度
     * @author White Mo
     * @date 2024/3/22
     */
    changeOpacity(opacity) {
      this.transferModel(window.modelObject, 0, 0, this.tz, opacity)
    },

    /**
     * @Description: 调用模型更改函数绕Z轴旋转
     * @author White Mo
     * @date 2024/3/22
     */
    changeRotationZ(rz) {
      this.rotationModel(window.modelObject, rz)
    },

    /**
     * @Description: 使用矩阵更改模型位置，平移模型
     * @author White Mo
     * @date 2024/3/22
     */
    transferModel(model, _tx, _ty, _tz, _opacity) {
      if (!this.checkModelLoad()) {
        return
      }
      let tx = _tx ? _tx : 0;
      let ty = _ty ? _ty : 0;
      let tz = _tz ? _tz : 0;
      let opacity = _opacity ? _opacity / 100 : 1

      if (model instanceof Cesium.Cesium3DTileset) {
        const origin = model.boundingSphere.center;
        const m = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//获取到以模型中心为原点,Z轴垂直地表的局部坐标系，以矩阵表示
        //平移
        const tempTranslation = new Cesium.Cartesian3(tx, ty, tz);//平移向量
        const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));//将局部坐标中（0，0，0）平移到（tx,ty,tz)后的世界坐标系中终点坐标
        const translation = Cesium.Cartesian3.subtract(offset, origin, new Cesium.Cartesian3());//终点世界坐标减去原点世界坐标得到世界坐标系下平移向量
        model.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        //透明度
        model.style = new Cesium.Cesium3DTileStyle({
          color: "color('rgba(255,255,255," + opacity + ")')",
        });
      } else if (model instanceof Cesium.Model) {
        let origin = new Cesium.Cartesian3(0, 0, 0)
        Cesium.Matrix4.multiplyByPoint(model.modelMatrix, origin, origin)
        console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(origin).latitude))
        console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(origin).longitude))
        console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(origin).height))
        const m = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//获取到以模型中心为原点,Z轴垂直地表的局部坐标系，以矩阵表示

        //平移
        const tempTranslation = new Cesium.Cartesian3(tx, ty, tz - this.originTz);//平移向量
        const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));//将局部坐标中（0，0，0）平移到（tx,ty,tz)后的世界坐标系中终点坐标

        const translation = Cesium.Cartesian3.subtract(offset, origin, new Cesium.Cartesian3());//终点世界坐标减去原点世界坐标得到世界坐标系下平移向量
        Cesium.Matrix4.multiply(Cesium.Matrix4.fromTranslation(translation), model.modelMatrix, model.modelMatrix)
        this.originTz = tz
      }

    },

    /**
     * @Description: 模型绕垂直地面的Z轴旋转,先将模型平移到地心，然后将局部坐标Z轴与世界坐标Z轴对齐，进行旋转，再恢复原本Z轴朝向，平移回原位置   矩阵乘法顺序为T2R2RR1T1M0
     * @author White Mo
     * @date 2024/3/26
     */
    rotationModel(tileset, rz) {

      if (!this.checkModelLoad()) {
        return
      }
      const origin = tileset.boundingSphere.center;
      console.log("初始世界坐标", origin)
      const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//获取到以模型中心为原点,Z轴垂直地表的局部坐标系的变换矩阵，左乘此矩阵可以将局部坐标变换为世界坐标
      const originMatrix = tileset.modelMatrix//贴地变换矩阵或者初始变换矩阵M0
      console.log("当前坐标变换矩阵", localToWorldMatrix)
      const backToEarthCenter = new Cesium.Cartesian3(-origin.x, -origin.y, -origin.z)//回到地心位移量
      let backToEarthCenterMatrix = Cesium.Matrix4.fromTranslation(backToEarthCenter);//回到地心变换矩阵
      Cesium.Matrix4.multiply(backToEarthCenterMatrix, originMatrix, backToEarthCenterMatrix)//贴地变换矩阵左乘回到地心矩阵 T1M0
      console.log("回到地心变换矩阵", backToEarthCenterMatrix)
      // 旋转
      //旋转模型使得Z轴与世界坐标Z轴重合
      let arrowX = new Cesium.Cartesian3(1, 0, 0)
      let arrowY = new Cesium.Cartesian3(0, 1, 0)
      let arrowZ = new Cesium.Cartesian3(0, 0, 1)
      let localArrowX = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, new Cesium.Cartesian3(1, 0, 0), new Cesium.Cartesian3)
      let localArrowY = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, new Cesium.Cartesian3(0, 1, 0), new Cesium.Cartesian3)
      let localArrowZ = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, new Cesium.Cartesian3(0, 0, 1), new Cesium.Cartesian3)
      let angleToXZ = Cesium.Cartesian3.angleBetween(arrowX, new Cesium.Cartesian3(localArrowZ.x, localArrowZ.y, 0))//局部Z轴在世界坐标系XY平面上投影到X轴角度，即绕Z顺时针旋转这个角度可以到XZ平面上
      let angleToZ = Cesium.Cartesian3.angleBetween(localArrowX, arrowZ)//然后绕Y轴顺时针旋转此角度可使得Z轴与世界坐标系Z轴重合
      const rotationAngleToXZ = Cesium.Matrix3.fromRotationZ(-angleToXZ);//此函数正方向为逆时针
      const rotationAngleToZ = Cesium.Matrix3.fromRotationY(-angleToZ);
      let rotationAngleToZMatrix = Cesium.Matrix3.multiply(rotationAngleToZ, rotationAngleToXZ, new Cesium.Matrix3)
      rotationAngleToZMatrix = Cesium.Matrix4.fromRotationTranslation(rotationAngleToZMatrix)
      Cesium.Matrix4.multiply(rotationAngleToZMatrix, backToEarthCenterMatrix, rotationAngleToZMatrix)//局部轴校正R1T1M0


      // 绕Z轴旋转
      console.log(rz - this.originRz)
      const rotationZ = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rz - this.originRz)); // 绕Z轴旋转变换矩阵R
      let rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotationZ)
      Cesium.Matrix4.multiply(rotationMatrix, rotationAngleToZMatrix, rotationMatrix)//RR1T1M0

      // 旋转模型回到原本朝向
      const rotationAngleLeaveXZ = Cesium.Matrix3.fromRotationZ(angleToXZ);
      const rotationAngleLeaveZ = Cesium.Matrix3.fromRotationY(angleToZ);
      let rotationAngleLeaveZMatrix = Cesium.Matrix3.multiply(rotationAngleLeaveXZ, rotationAngleLeaveZ, new Cesium.Matrix3)
      rotationAngleLeaveZMatrix = Cesium.Matrix4.fromRotationTranslation(rotationAngleLeaveZMatrix)// 局部Z轴回到原本方向
      Cesium.Matrix4.multiply(rotationAngleLeaveZMatrix, rotationMatrix, rotationAngleLeaveZMatrix)//R2RR1T1M0

      //回到原来位置
      const backToOriginMatrix = Cesium.Matrix4.fromTranslation(origin);//从地心回归原位T2
      // 应用变换矩阵

      const lastMatrix = Cesium.Matrix4.multiply(backToOriginMatrix, rotationAngleLeaveZMatrix, new Cesium.Matrix4)//最终矩阵T2R2RR1T1M0

      tileset.modelMatrix = lastMatrix
      console.log("结束世界坐标", tileset.boundingSphere.center)
      this.originRz = rz

    },


    remove3dData() {
      window.viewer.scene.primitives.remove(window.modelObject)
      window.modelObject = null
    },

    home() {
      this.remove3dData()
      viewer.camera.setView({
        // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
        // fromDegrees()方法，将经纬度和高程转换为世界坐标
        destination: Cesium.Cartesian3.fromDegrees(103.00, 29.98, 1500),
        orientation: {
          // 指向
          heading: 6.283185307179581,
          // 视角
          pitch: -1.5688168484696687,
          roll: 0.0
        }
      });
    },
    find() {
      if (this.checkModelLoad()) {
        if (window.modelObject instanceof Cesium.Cesium3DTileset) {
          window.viewer.zoomTo(window.modelObject)
        } else if (window.modelObject instanceof Cesium.Model) {
          let origin = new Cesium.Cartesian3(0, 0, 1000)
          Cesium.Matrix4.multiplyByPoint(window.modelObject.modelMatrix, origin, origin)
          window.viewer.camera.flyTo({
            destination: origin,
            orientation: {
              // 指向
              heading: 6.283185307179581,
              // 视角
              pitch: -1.5688168484696687,
              roll: 0.0
            }
          });
        }
      }
    },
    showArrow() {
      viewer.entities.removeAll()
      if (!this.showArrowValue) {
        let origin = window.modelObject.boundingSphere.center
        const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
        let localX = new Cesium.Cartesian3(100, 0, 0)
        let localY = new Cesium.Cartesian3(0, 100, 0)
        let localZ = new Cesium.Cartesian3(0, 0, 100)
        let localToWorldX = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, localX, new Cesium.Cartesian3)
        let localToWorldY = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, localY, new Cesium.Cartesian3)
        let localToWorldZ = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, localZ, new Cesium.Cartesian3)
        viewer.entities.add({
          name: "localX",
          position: localToWorldX,
          polyline: {
            positions: [origin, localToWorldX],
            width: 25,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
          },
          label: {
            text: 'X轴 正东方向',
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9)
          }
        });
        viewer.entities.add({
          name: "localY",
          position: localToWorldY,
          polyline: {
            positions: [origin, localToWorldY],
            width: 25,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
          },
          label: {
            text: 'Y轴 正北方向',
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9)
          }
        });
        viewer.entities.add({
          name: "localZ",
          position: localToWorldZ,
          polyline: {
            positions: [origin, localToWorldZ],
            width: 25,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.YELLOW),
          },
          label: {
            text: 'Z轴 垂直地面',
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9)
          }
        });
        this.showArrowValue = true
        this.showArrowText = "隐藏坐标轴"
      } else {
        this.showArrowValue = false
        this.showArrowText = "显示坐标轴"
      }
    },
    checkModelLoad() {
      if (window.modelObject)
        return true
      else
        this.$confirm('未加载模型', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(function () {
          this.tz = 0
          this.rz = 0
          this.originRz = 0
          this.originTz = 0
          this.opacity = 100
        })
      return false
    }
  }
}
</script>

<style>
#cesiumContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.markCollection {
  position: absolute;
  padding: 10px;
  top: 660px;
  left: 10px;
  background-color: rgba(40, 40, 40, 0.7);
  z-index: 10; /* 更高的层级 */
}

.markCollection span {
  margin: 5px;
  width: 30px;
  height: 30px;
}

.markCollection span:hover {
  cursor: pointer;
}

.noteContainer {
  position: absolute;
  padding: 15px;
  border-radius: 5px;
  top: 490px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.tool-container {
  position: absolute;
  padding: 15px;
  border-radius: 5px;
  width: 500px;
  top: 120px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.button-container {
  position: absolute;
  padding: 15px;
  border-radius: 5px;
  top: 10px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.latlon-legend {
  pointer-events: auto;
  position: absolute;
  border-radius: 15px;
  padding-left: 5px;
  padding-right: 5px;
  bottom: 30px;
  height: 30px;
  width: 125px;
  box-sizing: content-box;
}

.modelAdj {
  color: white;
  margin-bottom: 15px;
}
</style>
