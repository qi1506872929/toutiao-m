<template>
  <div class="user-chat">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="leftCancel"
    />

    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell v-for="(item, index) in messages" :key="index" :title="item.msg" />
    </van-cell-group>

    <!-- 底部 -->
    <van-cell-group class="send-message-wrap">
      <van-field v-model="message" placeholder="请输入消息" :border="false" />
      <van-button type="primary" size="small" @click="onSend">发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'UserChat',
  data() {
    return {
      message: '',
      socket: null, // Websocket 通信对象
      messages: getItem('chat-messages') || [] // 消息列表
    }
  },
  methods: {
    onSend() {
      // 请求发送消息
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      // 把用户发出去的消息存储到数组中
      this.messages.push(data)
      // 清空输入框
      this.message = ''
    },
    scrollToBottom() {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    },
    leftCancel() {
      this.$router.back()
      this.socket.close()
    }
  },
  created() {
    this.$destroy()
    // 建立连接
    const socket = io('/api')
    // const socket = io('/api1')
    this.socket = socket
    socket.on('connect', () => {
      console.log('建立连接成功了')
    })
    // 断开连接了
    socket.on('disconnect', () => {
      console.log('断开连接了')
    })
    // 监听 message 事件，接收服务端消息
    socket.on('message', data => {
      // 吧对方发给我的消息放到数组中
      this.message.push(data)
    })
  },
  watch: {
    messages() {
      setItem('chat-messages', this.messages)
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  mounted() {
    this.scrollToBottom()
  }
}
</script>

<style lang='less' scoped>
.message-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}

.send-message-wrap {
  display: flex;
  padding: 0 14px;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
