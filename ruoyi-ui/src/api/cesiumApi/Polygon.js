import * as Cesium from 'cesium'
import {Entity} from "cesium";

export default class Polygon {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.polygonEntity = null
        this.positions = [];
        this.lastItem = 0
    }

    activate() {
        this.leftClickEvent()
        this.rightClickEvent()
        this.mouseMoveEvent()
    }

    leftClickEvent() {
        let that = this
        this.handler.setInputAction(function (click) {
            //调用获取位置信息的接口
            let ray = viewer.camera.getPickRay(click.position)
            let position = viewer.scene.globe.pick(ray, viewer.scene)
            that.positions[that.lastItem] = position

            let tempLength = that.positions.length
            //调用绘制点的接口
            let point = that.drawPoint(position)
            that.lastItem++

            if (tempLength > 2) {
                that.drawPolygon()
            } else {
                // tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    rightClickEvent() {
        let that = this
        this.handler.setInputAction(function (click) {
            that.lastItem = 0
            let cartesian = that.viewer.camera.pickEllipsoid(click.position, that.viewer.scene.globe.ellipsoid)
            if (cartesian) {
                let tempLength = that.positions.length
                if (tempLength < 3) {
                    alert('请选择3个以上的点再执行闭合操作命令')
                } else {
                    that.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                    that.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    that.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }
            }
            // 计算面积
            let area = that.area(that.positions)
            document.getElementById("area").innerHTML = area.toFixed(2)
            // 计算实体个数
            let count = 0
            let posArr = []
            that.positions.forEach((item, index) => {
                let cartographicPosition = Cesium.Cartographic.fromCartesian(item)
                posArr[index] = [Cesium.Math.toDegrees(cartographicPosition.longitude), Cesium.Math.toDegrees(cartographicPosition.latitude)]
            })
            for (let i = 0; i < that.viewer.entities.values.length; i++) {
                if (that.viewer.entities.values[i]._billboard !== undefined) {
                    // 转经纬度
                    let posCartographicPosition = Cesium.Cartographic.fromCartesian(that.viewer.entities.values[i]._position._value)
                    let pos = {
                        lon: Cesium.Math.toDegrees(posCartographicPosition.longitude),
                        lat: Cesium.Math.toDegrees(posCartographicPosition.latitude)
                    }
                    // 笛卡尔2平面坐标
                    // let polygonPositions = that.polygonEntity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                    // let point = that.viewer.entities.values[i]._position._value
                    if (that.isPointInPolygon(posArr, pos)) {
                        count++
                    }
                    console.log(count, "调用处")
                }
            }
            document.getElementById("ispointIcon").innerHTML = count
            that.positions = []
            that.polygonEntity = null
            that.lastItem = 0
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }

    mouseMoveEvent() {
        let that = this
        this.handler.setInputAction(function (movement) {
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    drawPoint(position) {
        return this.viewer.entities.add({
            name: "点几何对象",
            position: position,
            point: {
                color: Cesium.Color.SKYBLUE,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        })
    }

    drawPolygon(positions, config_) {
        let that = this
        // if (positions.length < 2) return
        let config = config_ ? config_ : {}
        if (that.polygonEntity) {
            that.viewer.entities.remove(that.polygonEntity);
        }
        this.polygonEntity = new Entity({

            // name: "面几何对象",
            polygon: {
                hierarchy: that.positions,
                // hierarchy: new Cesium.CallbackProperty(e => {
                //     console.log("画图")
                //     return new Cesium.PolygonHierarchy(that.positions); // 真的有毒，line可以直接返回点，面就必须返回这个类型的玩意，西八,但是返回这个还会死循环
                //     // return that.positions.slice()
                // }, false),
                material: config.color ? new Cesium.Color.fromCssColorString(config.color).withAlpha(.2) : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
                clampToGround : true,
            },
            properties: {
                pointPositon: that.positions //存顶点的数组
            }
        })
        this.viewer.entities.add(this.polygonEntity)
    }

    //计算三角形面积
    triangleArea(p0, p1, p2) {
        let v0 = Cesium.Cartesian3.subtract(p0, p1, new Cesium.Cartesian3())
        let v1 = Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3())
        let cross = Cesium.Cartesian3.cross(v0, v1, v0);
        return Cesium.Cartesian3.magnitude(cross) * 0.5
    }

    //计算多边形面积
    area(positions) {
        let result = 0
        if (!Array.isArray(positions)) {
            console.log('不是数组');
            return result
        }
        //创建一个geometry
        let geometry = Cesium.CoplanarPolygonGeometry.createGeometry(
            Cesium.CoplanarPolygonGeometry.fromPositions({
                positions: positions,
                vertexFormat: Cesium.VertexFormat.POSITION_ONLY
            })
        )
        if (!geometry) {
            console.log('不是geometry');
            return result
        }
        //顶点坐标数组p;
        let flatPositions = geometry.attributes.position.values
        //确定geometry的基本体的索引，也就是组成其的三角形的索引，每三个为一组，组成一个三角形
        let indices = geometry.indices
        //计算三角形面积，最后加在一起
        for (let i = 0; i < indices.length; i += 3) {
            let p0 = Cesium.Cartesian3.unpack(
                flatPositions,
                indices[i] * 3,
                new Cesium.Cartesian3()
            )
            let p1 = Cesium.Cartesian3.unpack(
                flatPositions,
                indices[i + 1] * 3,
                new Cesium.Cartesian3()
            )
            let p2 = Cesium.Cartesian3.unpack(
                flatPositions,
                indices[i + 2] * 3,
                new Cesium.Cartesian3()
            )
            result += this.triangleArea(p0, p1, p2)
        }
        return result
    }

    //[[lon,lat],[lon,lat]]，{lon,lat}
    isPointInPolygon(polygonPositions, point) {
        let maxLongitude = polygonPositions[0][0]
        let minLongitude = polygonPositions[0][0]
        let maxLatitue = polygonPositions[0][1]
        let minLatitue = polygonPositions[0][1]
        polygonPositions.forEach((item, index) => {
            if (item[1] > maxLatitue) {
                maxLatitue = item[1]
            }
            if (item[1] < minLatitue) {
                minLatitue = item[1]
            }
            if (item[0] > maxLongitude) {
                maxLongitude = item[0]
            }
            if (item[0] < minLongitude) {
                minLongitude = item[0]
            }
        })
        if (point.lat < minLatitue || point.lat > maxLatitue) {
            return false
        }
        if (point.lon < minLongitude || point.lon > maxLongitude) {
            return false
        }
        let count = 0;
        // 射线是向右射
        for (let i = 0; i < polygonPositions.length; i++) {
            let pointItem1 = polygonPositions[i]
            let pointItem2 = polygonPositions[(i + 1) % polygonPositions.length]
            // 情况1：顶点重合
            if (pointItem1[0] === point.lon && pointItem1[1] === point.lat) {
                return true
            }
            // 情况2：射线（单方向，所以大于就够了）过顶点，所以算过两条边
            if (point.lat === pointItem1[1] && pointItem1[0] > point.lon) {
                count += 2
            }
            // 情况3：点在边上
            if (point.lat === pointItem1[1] && point.lat === pointItem2[1]) {
                if (point.lon > Math.min(pointItem1[0], pointItem2[0]) && point.lon < Math.max(pointItem1[0], pointItem2[0])) {
                    return true
                }
            }
            if (pointItem1[1] !== pointItem2[1] && point.lat > Math.min(pointItem1[1], pointItem2[1]) && point.lat < Math.max(pointItem1[1], pointItem2[1])) {
                let acrossLon = this.funOne(pointItem1, pointItem2, point)
                if (acrossLon === point.lon) {
                    return true
                }
                if (acrossLon > point.lon) {
                    count = count + 1
                }
            }
        }
        return count % 2 == 1
    }

    // 经度lon是x，纬度lat是y;lat = k * lon + b
    funOne(point1, point2, point) {
        let lat1 = point1[1]
        let lon1 = point1[0]
        let lat2 = point2[1]
        let lon2 = point2[0]
        let lat = point.lat
        let k = (lat1 - lat2) / (lon1 - lon2)
        let b = ((lat1 - k * lon1) + (lat2 - k * lon2)) / 2 //js精度损失
        let lon = (lat - b) / k
        // console.log(lon)
        return lon
    }
}