import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

export function getPloy(query) {
  return request({
    url: '/system/ploy/geteqploy',
    method: 'get',
    params: query
  })
}

// 新增标绘图片
export function addPlotIcon(data) {
  return request({
    url: '/system/ploy/addploticon',
    method: 'post',
    data: data
  })
}
// 删除单个标绘图片
export function deletePlotIcon(query) {
  return request({
    url: '/system/ploy/deleteploticon',
    method: 'get',
    params: query
  })
}
// 新增标绘图片
export function updataPlotIcon(data) {
  return request({
    url: '/system/ploy/updataploticon',
    method: 'post',
    data: data
  })
}
// 查询全部标绘图片
export function getPlotIcon(query) {
  return request({
    url: '/system/ploy/getploticon',
    method: 'get',
  })
}




