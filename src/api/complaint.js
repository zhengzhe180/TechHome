import request from '@/utils/request'

export function fetchList() {
  return request({
    url: 'http://localhost:8080/api/complaints',
    method: 'get'
  })
}
