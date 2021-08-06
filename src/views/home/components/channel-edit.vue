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
        :icon="(isEdit && index !== 0) ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onUserChannelClick(index)"
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
import { getAllChannels } from '@/api/channel'

export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
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
    onAdd (channel) {
      this.userChannels.push(channel)
    },
    // 点解频道操作
    onUserChannelClick (index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道
    deleteChannel (index) {
      this.userChannels.splice(index, 1)

      // 数据持久化
    },
    // 切换频道
    switchChannel (index) {
      console.log('切换频道')
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
    }
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
}
</style>
