import request from '@/utils/request'

export function getInstallationCounty(params) {
  return request({
    url: '/flat/dashboard/installation_county',
    method: 'get',
    params
  })
}

export function getInstallationGrid(params) {
  return request({
    url: '/flat/dashboard/installation_grid',
    method: 'get',
    params
  })
}

export function getInstallationTechnician(params) {
  return request({
    url: '/flat/dashboard/installation_technician',
    method: 'get',
    params
  })
}
