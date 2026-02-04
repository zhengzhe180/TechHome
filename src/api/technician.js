import request from '@/utils/request'

export function fetchComplaints(params) {
  return request({
    url: '/complaints',
    method: 'get',
    params
  })
}

export function fetchInstallations(params) {
  return request({
    url: '/installations',
    method: 'get',
    params
  })
}
