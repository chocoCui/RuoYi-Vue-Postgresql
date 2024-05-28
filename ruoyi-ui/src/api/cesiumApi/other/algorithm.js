import * as Cesium from "cesium";
import ArrowUtil from './ArrowUtil'

export default class Algorithm {

  constructor() {
    this.fineArrowDefualParam = {
      tailWidthFactor: 0.15,
      neckWidthFactor: 0.20,
      headWidthFactor: 0.25,
      headAngle: Math.PI / 8.5,
      neckAngle: Math.PI / 13
    };
    this.arrowUtil = new ArrowUtil()
  }
  fineArrow(tailPoint, headerPoint) {
    if ((tailPoint.length < 2) || (headerPoint.length < 2)) return;
    //画箭头的函数
    let tailWidthFactor = this.fineArrowDefualParam.tailWidthFactor;
    let neckWidthFactor = this.fineArrowDefualParam.neckWidthFactor;
    let headWidthFactor = this.fineArrowDefualParam.headWidthFactor;
    let headAngle = this.fineArrowDefualParam.headAngle;
    let neckAngle = this.fineArrowDefualParam.neckAngle;
    let o = [];
    o[0] = tailPoint;
    o[1] = headerPoint;
    let e = o[0],
      r = o[1],
      n = this.arrowUtil.getBaseLength(o),
      g = n * tailWidthFactor,
      //尾部宽度因子
      i = n * neckWidthFactor,
      //脖子宽度银子
      s = n * headWidthFactor,
      //头部宽度因子
      a = this.arrowUtil.getThirdPoint(r, e, this.arrowUtil.Constants.HALF_PI, g, !0),
      l = this.arrowUtil.getThirdPoint(r, e, this.arrowUtil.Constants.HALF_PI, g, !1),
      u = this.arrowUtil.getThirdPoint(e, r, headAngle, s, !1),
      c = this.arrowUtil.getThirdPoint(e, r, headAngle, s, !0),
      p = this.arrowUtil.getThirdPoint(e, r, neckAngle, i, !1),
      h = this.arrowUtil.getThirdPoint(e, r, neckAngle, i, !0),
      d = [];
    d.push(a[0], a[1], p[0], p[1], u[0], u[1], r[0], r[1], c[0], c[1], h[0], h[1], l[0], l[1], e[0], e[1]);
    return Cesium.Cartesian3.fromDegreesArray(d);
  }
}
