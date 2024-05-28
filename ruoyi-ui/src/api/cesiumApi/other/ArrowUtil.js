export default class ArrowUtil{
  constructor() {
    this.Constants = {
      TWO_PI: 2 * Math.PI,
      HALF_PI: Math.PI / 2,
      FITTING_COUNT: 100,
      ZERO_TOLERANCE: 1e-4
    }
  }
  getBaseLength(t) {
    return Math.pow(this.wholeDistance(t), .99)
  }
  wholeDistance(t){
    let o,e
    for (o = 0, e = 0; e < t.length - 1; e++) {
      o += this.distance(t[e], t[e + 1])
    };
    return o
  }
  distance(t, o){
    return Math.sqrt(Math.pow(t[0] - o[0], 2) + Math.pow(t[1] - o[1], 2))
  }
  getThirdPoint(t, o, e, r, n) {
    let g = this.getAzimuth(t, o),
      i = n ? g + e : g - e,
      s = r * Math.cos(i),
      a = r * Math.sin(i);
    return [o[0] + s, o[1] + a]
  }
  getAzimuth(t, o){
    let e, r = Math.asin(Math.abs(o[1] - t[1]) / this.distance(t, o));
    return o[1] >= t[1] && o[0] >= t[0] ? e = r + Math.PI : o[1] >= t[1] && o[0] < t[0] ? e = this.Constants.TWO_PI - r : o[1] < t[1] && o[0] < t[0] ? e = r : o[1] < t[1] && o[0] >= t[0] && (e = Math.PI - r), e
  }

}
