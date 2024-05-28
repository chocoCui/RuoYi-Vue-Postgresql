<template>
  <div class="home">
<!--    <CesiumScene />-->
    <home />
  </div>
</template>

<script>
// import CesiumScene from '@/components/Cesium/CesiumScene'
import home from '@/components/Cesium/home'
export default {
  name: "Index",
  components: {
    // CesiumScene
    home
  },
  data() {
    return {
      // 版本号
      // version: "3.8.7"
    };
  },
  methods: {
    // goTarget(href) {
    //   window.open(href, "_blank");
    // }
  }
};
</script>

<style scoped lang="scss">
.home{
  // 用百分比的时候要小心，比如用子hight用百分比，子的hight不仅仅是父的height计算得出子的hight，父的其他属性也可能影响到子的计算
  // 对于height和width来说，如果父没有的高度不是通过height计算得到的，就算写100%也没用。
  height: calc(100vh - 84px);
  //height: 100%;
}
</style>

