<template>
  <div class="channel-edit">
    <van-cell style="margin-bottom: 15px;" center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <van-grid :gutter="15">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <van-cell
      style="margin-top: 25px; margin-bottom: 15px;"
      center
      :border="false"
    >
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="15">
      <van-grid-item
        class="grid-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false // 控制编辑的显示状态
    }
  },
  methods: {
    //   加载所有频道数据
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 添加频道
    async onAdd (channel) {
      this.userChannels.push(channel)
      // 登录了，数据存储到线上，未登录，存储到本地
      if (this.user) {
        await addUserChannels({
          id: channel.id,
          seq: this.userChannels.length
        })
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    // 点击频道操作
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道
    async deleteChannel (channel, index) {
      // 如果删除的是当前的激活频道之前的频道
      if (index <= this.active) {
        // 更新频道索引
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) { // 登录了，数据持久化到线上，未登录，持久化到本地
        await deleteUserChannels(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    // 切换频道
    switchChannel (index) {
      console.log('切换频道')
      // 切换频道
      this.$emit('update-active', index)
      // 关闭弹出层
      this.$emit('close')
    }
  },
  computed: {
    //   推荐的频道列表
    recommendChannels () {
      // 所有频道 - 我的频道 = 剩下的推荐频道
      //   return this.allChannels.filter(channel => this.userChannels.every(userChannel => userChannel.id !== channel.id))
      return this.allChannels.filter(
        channel =>
          !this.userChannels.find(userChannel => userChannel.id === channel.id)
      )
    },
    ...mapState(['user'])
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;

  .channel-title {
    font-size: 16px;
    color: #333333;
  }

  // 频道样式
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }

  // 激活的频道高亮
  .active {
    /deep/ .van-grid-item__content {
      .van-grid-item__text {
        color: red;
      }
    }
  }
}
</style>
