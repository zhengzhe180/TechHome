<template>
  <div class="ai-chat-fullpage">
    <deep-chat
      v-if="isReady"
      ref="deepChat"
      :initial-messages="initialMessages"
      :text-input="textInputConfig"
      :message-styles="messageStylesConfig"
      :style="{ width: '100%', height: '100%' }"
      :container-style="{
        width: '100%',
        height: '100%',
        border: 'none'
      }"
    />
  </div>
</template>

<script>
import { sendChatMessage } from '@/api/ai-chat'

export default {
  name: 'AiChat',
  data() {
    return {
      isReady: false,
      initialMessages: [
        {
          role: 'ai',
          text: '您好!我是智能问述助手,请问有什么可以帮您?'
        }
      ],
      textInputConfig: {
        placeholder: { text: '输入您的问题...' },
        submit: {
          commandKey: false, // 禁用 Cmd/Ctrl+Enter 发送
          shiftKey: false // 禁用 Shift+Enter 发送
        }
      },
      messageStylesConfig: {
        default: {
          shared: { bubble: { maxWidth: '70%', borderRadius: '12px', padding: '10px 14px' }},
          user: { bubble: { backgroundColor: '#409eff', color: '#ffffff' }},
          ai: { bubble: { backgroundColor: '#f4f4f5', color: '#303133' }}
        }
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.isReady = true

      this.$nextTick(() => {
        const chatElement = this.$refs.deepChat
        if (chatElement) {
          chatElement.demo = false
          // ⭐ 使用 request.handler 调用后端 API
          chatElement.request = {
            handler: this.handleRequest.bind(this)
          }
          console.log('DeepChat 配置成功 - 后端 API 模式')
        }
      })
    }, 100)
  },

  methods: {
    /**
     * DeepChat 连接处理器 - 调用后端 API
     * @param {Object} body - 包含用户消息的请求体
     * @param {Array} signals - 用于发送响应的信号对象
     */
    async handleRequest(body, signals) {
      try {
        // 1. 提取用户消息
        const userMessage = body.messages?.[body.messages.length - 1]?.text || ''

        console.log('用户输入:', userMessage)

        // 2. 调用后端 API（使用你原来的 sendChatMessage 方法）
        const response = await sendChatMessage({
          message: userMessage
          // 根据你的 API 添加其他必要参数
          // conversationId: this.conversationId,
          // userId: this.userId,
          // 等等...
        })

        console.log('后端响应:', response)

        // 3. ⭐ 关键：使用 signals.onResponse 发送响应
        // 根据你的后端返回格式调整取值路径
        const replyText = response.data?.content ||
          response.data?.reply ||
          response.data?.text ||
          response.content ||
          response.reply ||
          response.text ||
          '抱歉，我没有理解您的问题'

        signals.onResponse({
          text: replyText
        })
      } catch (error) {
        console.error('AI 请求失败:', error)

        // 4. 错误处理：返回错误消息
        signals.onResponse({
          text: '抱歉，服务暂时不可用，请稍后再试'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 确保父容器占据屏幕高度 */
.ai-chat-fullpage {
  width: 100%;
  height: calc(100vh - 84px); /* 适配 TechHome 布局高度 */
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
/* 覆盖 Shadow DOM 样式，确保占满全屏 */
.ai-chat-fullpage deep-chat {
  width: 100% !important;
  height: 100% !important;
}

deep-chat::part(container) {
  width: 100% !important;
  height: 100% !important;
}

deep-chat::part(messages-container) {
  flex-grow: 1 !important;
}
</style>
