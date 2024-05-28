<template>
  <div class="listInfoClass">

  </div>
</template>

<script>
export default {
  name: "listInfo",
  data(){
    return{

    }
  },
  methods:{
    tableHeaderColor(){
      return 'border-color:#313a44;background-color: #313a44;color: #fff;padding: 0;'
    },
    // 修改table header的背景色
    tableColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex%2==1) {
        return 'border-color:#313a44;background-color: #313a44;color: #fff;padding: 0;'
      }else{
        return 'border-color:#304156;background-color: #304156;color:#fff;padding: 0;'
      }
    },
  }
}
</script>

<style scoped>
.listInfoClass{
  height: calc(50vh - 35px);
  border-radius: 10px;
  background: rgba(4, 16, 51, 0.4);
  margin: 10px;
}
</style>
