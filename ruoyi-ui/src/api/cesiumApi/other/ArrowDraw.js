// import * as Cesium from "cesium";
// import {StraightArrow} from "./Arrow"
//
// export default class ArrowDraw {
//   constructor(viewer) {
//     this.viewer = viewer
//     this.isActivate= false
//     this.drawArr= []
//     this.handler= null
//     this.viewer= null
//     this.nowArrowObj= null
//   }
//   init(viewer) {
//     if (!this.isActivate) {
//       this.isActivate = true
//       this.viewer = viewer
//       this.bindEdit()
//     }
//   }
//   disable() {
//     if (this.isActivate) {
//       this.isActivate = false;
//       for (let i = 0; i < this.drawArr.length; i++) {
//         this.drawArr[i].disable();//这个disable不是本类中的disable
//       }
//       this.drawArr = [];
//       if (this.handler) {
//         this.handler.destroy();
//         this.handler = null;
//       }
//       this.viewer = null;
//     }
//   }
//   draw(type) {
//     for (let i = 0; i < this.drawArr.length; i++) {
//       this.drawArr[i].disableHandler();
//     }
//     switch (type) {
//       case "straightArrow":
//         let straightArrow = new StraightArrow(viewer);
//         straightArrow.startDraw();
//         this.drawArr.push(straightArrow);
//         break;
//       // case "attackArrow":
//       //   let attackArrow = new AttackArrow(viewer);
//       //   attackArrow.startDraw();
//       //   this.drawArr.push(attackArrow);
//       //   break;
//       // case "pincerArrow":
//       //   let pincerArrow = new PincerArrow(viewer);
//       //   pincerArrow.startDraw();
//       //   this.drawArr.push(pincerArrow);
//       default:
//         break;
//     }
//   }
//   bindEdit() {
//     let that = this;
//     this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
//     this.handler.setInputAction(function(evt) { //单机开始绘制
//       let pick = that.viewer.scene.pick(evt.position)
//       if (Cesium.defined(pick) && pick.id) {
//         if (that.nowArrowObj) {
//           if (that.nowArrowObj.state !== -1) {
//             console.log("上一步操作未结束，请继续完成上一步！")
//             return
//           }
//         }
//         for (let i = 0; i < that.drawArr.length; i++) {
//           if (pick.id.objId === that.drawArr[i].objId) {
//             that.nowArrowObj = that.drawArr[i]
//             that.drawArr[i].startModify()
//             break
//           }
//         }
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
//   }
//   clearOne() {
//     let that = this;
//     this.handler.setInputAction(function(evt) { //单机开始绘制
//       let pick = viewer.scene.pick(evt.position);
//       if (Cesium.defined(pick) && pick.id) {
//         for (let i = 0; i < that.drawArr.length; i++) {
//           if (pick.id.objId === that.drawArr[i].objId) {
//             that.drawArr[i].clear();
//             that.drawArr.splice(i, 1);
//             break;
//           }
//         }
//         that.handler.destroy();
//         that.bindEdit();
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//   }
// }
