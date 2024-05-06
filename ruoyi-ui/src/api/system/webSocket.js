import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

export function getWs(query) {
  return request({
    url: '/system/ws/ws',
    method: 'get',
    params: query
  })
}


