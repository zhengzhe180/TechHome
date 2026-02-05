<template>
  <div class="ai-chat-container">
    <!-- 顶部标题 -->
    <div class="chat-header">
      <h2>智能问述</h2>
    </div>

    <!-- 对话区域 -->
    <el-scrollbar class="chat-content" wrap-class="chat-scroll-wrap">
      <div class="message-list">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', msg.role === 'user' ? 'user-message' : 'ai-message']"
        >
          <!-- AI 头像 -->
          <img v-if="msg.role === 'ai'" src="@/assets/avatar-ai.png" class="avatar" />
          <!-- 用户头像 -->
          <img v-else src="@/assets/avatar-user.png" class="avatar" />

          <el-card class="message-card" shadow="hover">
            <div class="message-text">{{ msg.content }}</div>
          </el-card>
        </div>

        <!-- AI 思考中动画 -->
        <div v-if="isTyping" class="message-item ai-message">
          <img src="@/assets/avatar-ai.png" class="avatar" />
          <el-card class="message-card" shadow="hover">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="input-wrapper">
        <el-input
          v-model="userInput"
          placeholder="输入您的问题..."
          @keyup.enter.native="handleSend"
          :disabled="isTyping"
          class="chat-input"
        />
        <el-button
          type="primary"
          class="send-btn"
          icon="el-icon-s-promotion"
          @click="handleSend"
          :loading="isTyping"
          :disabled="!userInput.trim()"
        >
          发送
        </el-button>
      </div>
      <div class="input-tips">按 Enter 发送，Shift + Enter 换行</div>
    </div>
  </div>
</template>

<script>
import { sendChatMessage } from '@/api/ai-chat'

export default {
  name: 'AiChat',
  data() {
    return {
      userInput: '',
      messages: [
        {
          role: 'ai',
          content: '您好！我是智能问述助手，请问有什么可以帮您？'
        }
      ],
      isTyping: false
    }
  },
  methods: {
    async handleSend() {
      const content = this.userInput.trim()
      if (!content || this.isTyping) return

      // 1. 添加用户消息
      this.messages.push({
        role: 'user',
        content: content
      })

      // 清空输入框
      this.userInput = ''
      this.isTyping = true

      try {
        // 2. 调用后端接口
        const response = await sendChatMessage({ message: content })

        // 3. 添加 AI 消息（根据实际接口返回字段调整）
        this.messages.push({
          role: 'ai',
          content: response.data?.content || response.data?.reply || '暂无回复'
        })
      } catch (error) {
        console.error('AI 问述错误:', error)
        this.$message.error('获取回复失败，请重试')
      } finally {
        this.isTyping = false
      }

      // 滚动到底部
      this.$nextTick(() => {
        const scrollWrap = document.querySelector('.chat-scroll-wrap')
        if (scrollWrap) {
          scrollWrap.scrollTop = scrollWrap.scrollHeight
        }
      })
    }

    // // Mock AI 回复接口（已注释，使用真实接口）
    // mockAiResponse(question) {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       const responses = [
    //         '这是一个很好的问题，让我来分析一下...',
    //         '根据您提供的信息，我的建议是：',
    //         '我已经理解了您的问题，以下是详细解答：',
    //         '这个问题涉及多个方面，我来为您逐一说明。'
    //       ]
    //       const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    //       resolve(`收到您的问题："${question}"\n\n${randomResponse}`)
    //     }, 1500) // 模拟 1.5 秒延迟
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px); // 减去头部和 padding
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  h2 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }
}

.chat-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &.user-message {
    flex-direction: row-reverse;

    .message-card {
      background-color: #409eff;
      color: #fff;
    }

    .avatar {
      order: 2;
    }
  }

  &.ai-message {
    .message-card {
      background-color: #fff;
      color: #303133;
    }
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-card {
  max-width: 70%;
  border-radius: 8px;
  ::v-deep .el-card__body {
    padding: 12px 16px;
  }
}

.message-text {
  white-space: pre-wrap;
  line-height: 1.6;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;

  span {
    width: 8px;
    height: 8px;
    background-color: #909399;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input-area {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-input {
  ::v-deep .el-input__inner {
    height: 48px;
    border-radius: 12px;
    border: 2px solid #e4e7ed;
    font-size: 15px;
    transition: all 0.3s;

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
    }

    &::placeholder {
      color: #c0c4cc;
    }
  }
}

.send-btn {
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 15px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: none;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #c0c4cc;
    cursor: not-allowed;
  }
}

.input-tips {
  text-align: center;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
