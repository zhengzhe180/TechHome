import request from '@/utils/request'

export function fetchListAccumulated(query) {
  return request({
    url: '/installation/accumulated',
    method: 'post',
    data: query
  })
}

export function fetchListCleared(query) {
  return request({
    url: '/installation/cleared',
    method: 'post',
    data: query
  })
}

export function fetchListWordCui(query) {
  return request({
    url: '/installation/word-cui',
    method: 'post',
    data: query
  })
}

export function fetchListUrgentUnarchivedOrders(query) {
  return request({
    url: '/installation/urgent-unarchived-orders',
    method: 'post',
    data: query
  })
}

export function fetchListManualJudgmentRedYellowOrders(query) {
  return request({
    url: '/installation/91x',
    method: 'post',
    data: query
  })
}

export function fetchListZhuangWeiXuanZhiZhuangWeiHeShi(query) {
  return request({
    url: '/installation/site-verification',
    method: 'post',
    data: query
  })
}

export function exportListCleared(query) {
  return request({
    url: '/installation/cleared/export',
    method: 'post',
    data: query
  })
}

export function exportListAccumulated(query) {
  return request({
    url: '/installation/accumulated/export',
    method: 'post',
    data: query
  })
}

export function exportListUrgentUnarchivedOrders(query) {
  return request({
    url: '/installation/urgent-unarchived-orders/export',
    method: 'post',
    data: query
  })
}

export function exportListManualJudgmentRedYellowOrders(query) {
  return request({
    url: '/installation/91x/export',
    method: 'post',
    data: query
  })
}

export function exportListZhuangWeiXuanZhiZhuangWeiHeShi(query) {
  return request({
    url: '/installation/site-verification/export',
    method: 'post',
    data: query
  })
}

export function exportListWordCui(query) {
  return request({
    url: '/installation/word-cui/export',
    method: 'post',
    data: query
  })
}

export function fetchListTomorrow(query) {
  return request({
    url: '/installation/tomorrow',
    method: 'post',
    data: query
  })
}
export function exportListTomorrow(query) {
  return request({
    url: '/installation/tomorrow/export',
    method: 'post',
    data: query
  })
}
