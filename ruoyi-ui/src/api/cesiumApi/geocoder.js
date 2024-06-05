import * as Cesium from "cesium";
import {TianDiTuToken} from "./config";

/**
 * 自定义geocoders服务
 * opensteet政治不正确，涉及国家领土边界区划勿用
 * 相关配置查看官方文档
 * https://nominatim.openstreetmap.org/ui/search.html
 */
function OpenStreetMapNominatimGeocoder() {
}

OpenStreetMapNominatimGeocoder.prototype.geocode = function (input) {
    const query = `format=jsonv2&accept-language=zh&polygon_geojson=1&countrycodes=cn&q=${input}`
    const requestString = "https://nominatim.openstreetmap.org/search?" + query;
    return Cesium.Resource.fetchJson(requestString) //请求url获取json数据
        .then(function (results) {
            let bboxDegrees;
            return results.map(function (resultObject) {
                bboxDegrees = resultObject.boundingbox;
                return {
                    displayName: resultObject.display_name,
                    destination: Cesium.Rectangle.fromDegrees(
                        bboxDegrees[2],
                        bboxDegrees[0],
                        bboxDegrees[3],
                        bboxDegrees[1]
                    ),
                };
            });
        });
};

/**
 * 自定义geocoders服务，采用国内高德地图数据
 */
function AMapNominatimGeocoder() {
}

AMapNominatimGeocoder.prototype.geocode = function (input) {
    const query = `key=****&keywords=${input}`;
    const requestString = "https://restapi.amap.com/v3/place/text?" + query;
    return Cesium.Resource.fetchJson(requestString) //请求url获取json数据
        .then(function (results) {
            return results.pois.map(function (bboxDegrees) {
                let [lng, lat] = bboxDegrees['location'].split(',')
                return {
                    displayName: bboxDegrees['name'],
                    destination: Cesium.Rectangle.fromDegrees(
                        lng,
                        lat,
                        lng,
                        lat,
                    ),
                };
            });
        });
};

/**
 * 自定义geocoders服务，采用国内天地图数据
 */
function TianDiTuGeocoder() {
}

TianDiTuGeocoder.prototype.geocode = function (input) {

    // const query = '{"keyWord":"' + input + '","level":12,"mapBound":"-180,-90,180,90","queryType":"12","start":0,"count":1}&type=query&tk=' + TianDiTuToken;
    const query = '{"keyWord":"' + input + '"}&tk=' + TianDiTuToken;
    const requestString = "http://api.tianditu.gov.cn/geocoder?ds=" + query;
    return Cesium.Resource.fetchJson(requestString) //请求url获取json数据
        .then(function (results) {
                // let resultType = results.resultType
                // if (resultType == 1) {
                //     let pois = results.pois
                //     if (!pois) {
                //         return
                //     }
                //     return pois.map((poi) => {
                //         let lonlat = poi.lonlat
                //         let lon = Number(lonlat.split(",")[0])
                //         let lat = Number(lonlat.split(",")[1])
                //         return {
                //             displayName: poi.name,
                //             destination: Cesium.Rectangle.fromDegrees(
                //                 lon,//west
                //                 lat,//south
                //                 lon,//east
                //                 lat//north
                //             )
                //         }
                //     })
                // } else if (resultType == 2) {//统计
                //     console.log(results)
                //     let statistics = results.statistics
                //     if (!statistics) {
                //         return
                //     }
                //     return statistics.priorityCitys.map((item) => {
                //         let lon = item.lonlat.split(",")[0]
                //         let lat = item.lonlat.split(",")[1]
                //         let displayName
                //         if (input.split(",").length < 2) {
                //             displayName = input + "," + item.adminName
                //         } else {
                //             console.log(item.adminName)
                //             displayName = input.split(",")[0] + "," + item.adminName
                //         }
                //         console.log(input.split(",").length)
                //         return {
                //             displayName: displayName,
                //             destination: Cesium.Rectangle.fromDegrees(
                //                 lon,//west
                //                 lat,//south
                //                 lon,//east
                //                 lat//north
                //             )
                //         }
                //     })
                // } else if (resultType == 3) {//行政区
                //     let area = results.area
                //     if (!area) {
                //         return
                //     }
                //     let bound = area.bound
                //     return {
                //         displayName: area.name,
                //         destination: Cesium.Rectangle.fromDegrees(
                //             bound.split(",")[0],
                //             bound.split(",")[1],
                //             bound.split(",")[2],
                //             bound.split(",")[3],
                //         )
                //     }
                // } else {//4和5没有测试到
                //     return
                // }
                return [{
                    displayName: input,
                    destination: Cesium.Rectangle.fromDegrees(
                        results.location.lon,
                        results.location.lat,
                        results.location.lon,
                        results.location.lat,
                    )
                }]
            }
        );
}

export {
    OpenStreetMapNominatimGeocoder,
    AMapNominatimGeocoder,
    TianDiTuGeocoder
}
