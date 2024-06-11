const cesium = {
  state: {
    pointInfo:{
      lat: null,
      lon: null,
      height: null,
      img:null,
      type:null,
      id:null,
      time: null,
      name: null,
      describe: null,
      eqid:null
    },
  },
  mutations: {
    SET_POINTINFO1: (state,pointInfo)=>{
      state.pointInfo.lat = pointInfo.lat
      state.pointInfo.lon = pointInfo.lon
      state.pointInfo.height = pointInfo.height
      state.pointInfo.type = pointInfo.type
      state.pointInfo.id = pointInfo.id
      state.pointInfo.img = pointInfo.img
      state.pointInfo.eqid = pointInfo.eqid
    },
    SET_POINTINFO2:(state,pointInfo)=>{
      state.pointInfo.time = pointInfo.time
      state.pointInfo.name = pointInfo.name
      state.pointInfo.describe = pointInfo.describe
    },
    CLEAR_POINTINFO:(state)=>{
      Object.keys(state.pointInfo).forEach(key=>{
        state.pointInfo[key] = null
      })
    },
  }
}

export default cesium
