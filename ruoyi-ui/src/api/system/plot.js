import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

export function getPloy(query) {
  return request({
    url: '/system/ploy/geteqploy',
    method: 'get',
    params: query
  })
}


