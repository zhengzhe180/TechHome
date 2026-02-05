import request from '@/utils/request'

// AI 智能问述接口
export function sendChatMessage(data) {
  return request({
    url: '/flat/ai-chat/chat',
    method: 'post',
    data
  })
}
