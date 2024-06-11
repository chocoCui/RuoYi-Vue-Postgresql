import request from '@/utils/request'

//增
export function addEq(data) {
  return request({
    url: '/system/addeq',
    method: 'post',
    data: data
  })
}
// 删
export function deleteeq(query) {
  return request({
    url: '/system/deleteeq',
    method: 'get',
    params: query
  })
}
// 查
export function getAllEq(query) {
  return request({
    url: '/system/geteq',
    method: 'get',
  })
}
// 改
export function updataEq(data) {
  return request({
    url: '/system/updataeq',
    method: 'post',
    data: data
  })
}
