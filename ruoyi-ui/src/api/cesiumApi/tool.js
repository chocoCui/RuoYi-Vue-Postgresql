// 造一个这样类型的数据
// typeList:[
    //   {
    //     value:'resumeTeam',
    //     label:'救援队',
    //     img: resumeTeam
    //   },
    //   {
    //     value:'roadDestory',
    //     label:'道路损毁',
    //     img: roadDestory
    //   },
    //   {
    //     value:'resumeArea',
    //     label:'救援区域',
    //     img: resumeArea
    //   },
    //   {
    //     value:'danger',
    //     label:'伤亡区域',
    //     img: danger
    //   },
    //   {
    //     value: 'trainStation',
    //     label: '火车站',
    //     img:trainStation,
    //   },
    //   {
    //     value: 'airport',
    //     label: '机场',
    //     img:airport,
    //   },
    //   {
    //     value: 'gas',
    //     label: '燃气点',
    //     img:gas,
    //   },
    //   {
    //     value: 'school',
    //     label: '学校',
    //     img:school,
    //   },
    //   {
    //     value:'baseStation',
    //     label:'基站',
    //     img: baseStation
    //   },
    //   {
    //     value:'signalStation',
    //     label:'信号站',
    //     img: signalStation
    //   },
    //   {
    //     value: 'fireStation',
    //     label: '消防站',
    //     img:fireStation,
    //   },
    //   {
    //     value: 'commandCenter',
    //     label: '指挥中心',
    //     img:commandCenter,
    //   },
    //   {
    //     value:'hospital',
    //     label:'医院',
    //     img: hospital
    //   },
    // ],
function markPhotoList(){
    let typeList = []
    //require.context参数 (要搜索的文件夹路径，是否搜索子路径,匹配文件的正则表达式)
    const requireContext = require.context('@/assets/noteImg',true,/\.(png|jpe?g|svg|gif)$/);
    requireContext.keys().forEach(key=>{
        typeList.push({
            value: key.split('/').pop().split('.')[0],
            label: key.split('/').pop().split('.')[0],
            img: requireContext(key)
        })
    })
    return typeList
}
// 图片名要(英文名,中文名)中间是英文逗号
function refenceMarkPhotoList(){
    let refencObj = {}
    const requireContext = require.context('@/assets/noteImg',true,/\.(png|jpe?g|svg|gif)$/);
    requireContext.keys().forEach(key=>{
        let keyName = key.split('/').pop().split('.')[0]
        let refenceName = keyName.split(',')[1]
        Object.defineProperty(refencObj,keyName,{value:refenceName,writable: true, enumerable: true, configurable: true })
    })
    return refencObj
}
function matchMark(){
    let matchList = {}
    const requireContext = require.context('@/assets/noteImg',true,/\.(png|jpe?g|svg|gif)$/);
    requireContext.keys().forEach(key=>{
        // matchList.key.split('/').pop().split('.')[0] = requireContext(key)
        Object.defineProperty(matchList, key.split('/').pop().split('.')[0], { value: requireContext(key), writable: true, enumerable: true, configurable: true })
    })
    return matchList
}
export {
    markPhotoList,refenceMarkPhotoList,matchMark,
}
