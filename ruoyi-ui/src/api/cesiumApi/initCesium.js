import {CesiumIonDefaultAccessToken, TianDiTuToken} from './config'
import * as Cesium from "cesium";
import {AMapNominatimGeocoder, OpenStreetMapNominatimGeocoder, TianDiTuGeocoder} from "./geocoder";


export function initCesium(Cesium) {
    // 使用Cesium官方示例中的Token
    Cesium.Ion.defaultAccessToken = CesiumIonDefaultAccessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmRiNjM4MC1kMDZkLTQ2NDQtYjQ3My0xZDI4MDU0MGJhZDciLCJpZCI6MzIxMzAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTY1MjM4NzZ9.A3FBZ6HjKkTsOGnjwWWeO9L10HQ9c-wcF4c3dtTc4gQ'
    let viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true,
        animation: false, // 是否创建动画小器件，左下角仪表
        baseLayerPicker: true, // 是否显示图层选择器，前往cesium源码./cesium/Source/Widgets/BaseLayerPicker.js中修改terrainTitle.innerHTML为中文
        fullscreenButton: false, // 是否显示全屏按钮
        geocoder: new TianDiTuGeocoder(), // 是否显示geocoder小器件，右上角查询按钮,此处使用自定义
        homeButton: false, // 是否显示Home按钮
        infoBox: false, // 是否显示信息框
        sceneModePicker: false, // 是否显示3D/2D选择器
        selectionIndicator: true, // 是否显示选取指示器组件
        timeline: false, // 是否显示时间轴
        navigationHelpButton: false, // 是否显示右上角的帮助按钮
        scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源


        // 天地图影像
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TianDiTuToken}`,
        //   layer: 'tdtBasicLayer',
        //   style: 'default',
        //   format: 'image/jpeg',
        //   tileMatrixSetID: 'GoogleMapsCompatible',
        // })
        // 本地geoserver影像
        // imageryProvider: new Cesium.WebMapServiceImageryProvider({
        //   url: 'http://localhost:9080/geoserver/yaan/wms',
        //   layers: 'yaan:yaan',
        //   parameters: {
        //     service: 'WMS',
        //     format: 'image/png',
        //     transparent: true
        //   }
        // })
        // terrainProvider: new Cesium.CesiumTerrainProvider({
        //     url: "http://localhost:9080/geoserver/www/dem",
        // }),


        //获取或设置可用于图像选择的ProviderViewModel实例数组。
        imageryProviderViewModels: getImageryProviderArr(),
        //获取或设置可用于地形选择的ProviderViewModel实例数组。
        terrainProviderViewModels: getTerrainProviderViewModelsArr(),
    })
    // viewer.extend(Cesium.viewerCesiumInspectorMixin);
    // viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
    viewer.scene.globe.enableLighting = false//全局光照
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
    return viewer
}

//图层
function getImageryProviderArr() {
    return [
        new Cesium.ProviderViewModel({
            //图层的名称。
            name: '天地图',
            //显示项目被隐藏的工具提示
            tooltip: '天地图',
            //代表图层的图标
            iconUrl: require('@/assets/bingAerial.png'),
            //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中。
            creationFunction: function () {
                return new Cesium.WebMapTileServiceImageryProvider({
                    url: `http://t0.tianditu.com/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TianDiTuToken}`,
                    format: 'tiles',
                    tileMatrixSetID: 'c',
                    tilingScheme: new Cesium.GeographicTilingScheme(),
                    tileMatrixLabels: ['1', '2', '3', '4',
                        '5', '6', '7', '8', '9', '10', '11',
                        '12', '13', '14', '15', '16', '17', '18'],
                    layer: "tdtImgAnnoLayer",
                    style: "default",
                    show: false
                })
            }
        }),
        new Cesium.ProviderViewModel({
            //图层的名称。
            name: 'Bing底图',
            //显示项目被隐藏的工具提示
            tooltip: '默认Bing底图',
            //代表图层的图标
            iconUrl: require('@/assets/bingAerial.png'),
            //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中。
            creationFunction: function () {
                return Cesium.createWorldImagery({
                    style: Cesium.IonWorldImageryStyle.AERIAL
                })
            }
        }),
        // 本地geoserver影像
        new Cesium.ProviderViewModel({
            //图层的名称。
            name: '本地底图',
            //显示项目被隐藏的工具提示
            tooltip: '本地底图',
            //代表图层的图标
            iconUrl: require('@/assets/bingAerial.png'),
            //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中。
            creationFunction: function () {
                return new Cesium.WebMapServiceImageryProvider({
                    url: 'http://localhost:9080/geoserver/yaan/wms',
                    layers: 'yaan:yaan',
                    parameters: {
                        service: 'WMS',
                        format: 'image/png',
                        transparent: true
                    }
                })
            }
        }),

    ]
}

//地形
function getTerrainProviderViewModelsArr() {
    let baseURL = process.env.VUE_APP_API_URL
    return [
        new Cesium.ProviderViewModel({
            //图层的名称
            name: '仅底图',
            //显示项目被隐藏的工具提示
            tooltip: 'WGS84标准球体',
            //代表图层的图标
            iconUrl: require('@/assets/Ellipsoid.png'),
            //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中
            creationFunction: function () {
                return new Cesium.EllipsoidTerrainProvider({
                    ellipsoid: Cesium.Ellipsoid.WGS84
                })
            }
        }),
        new Cesium.ProviderViewModel({
            //图层的名称
            name: '本地DEM地形',
            //显示项目被隐藏的工具提示
            tooltip: 'DEM地形',
            //代表图层的图标
            iconUrl: require('@/assets/CesiumWorldTerrain.png'),
            //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中
            creationFunction: function () {
                return new Cesium.CesiumTerrainProvider({
                    url: baseURL+'/geoserver/www/dem',
                    requestWaterMask: !0,
                    requestVertexNormals: !0,
                    // isSct : false //是否为iServer发布的TIN地形服务,stk地形设置为false。
                })
            }
        }),
        new Cesium.ProviderViewModel({
            //图层的名称
            name: 'Cesium地形',
            //显示项目被隐藏的工具提示
            tooltip: 'Cesium地形',
            //代表图层的图标
            iconUrl: require('@/assets/CesiumWorldTerrain.png'),
            //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中
            creationFunction: function () {
                return new Cesium.CesiumTerrainProvider({
                    url: Cesium.IonResource.fromAssetId(1),
                    requestWaterMask: !0,
                    requestVertexNormals: !0,
                    // isSct : false //是否为iServer发布的TIN地形服务,stk地形设置为false。
                })
            }
        }),
    ]
}

