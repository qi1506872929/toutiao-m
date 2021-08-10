<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <!-- 标签页组件有一个功能，只有第一次查看标签页的时候才会渲染里面的内容 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>

      <!-- 添加一个占位元素，避免列表被展开按钮挡住 -->
      <div slot="nav-right" class="wrap-nav-placeholder"></div>

      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>

    <!-- 展开频道列表 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%;"
    >
      <ChannelEdit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  data() {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道的显示状态
    }
  },
  methods: {
    async loadChannels() {
      let channels = []
      if (this.user) {
        // 已登录，请求频道数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录，从本地存储导入
        const localChannels = getItem('user-channels')
        // 如果有本地存储则使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 没有本地存储,请求默认的推荐频道
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    }
  },
  created() {
    this.loadChannels()
  },
  computed: {
    ...mapState([ 'user' ])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  // 搜索按钮
  .search-btn {
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }

  // 文章频道列表
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
    }
  }

  // 展开列表按钮
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 24px;
    }
    &::before {
      content: "";
      width: 1px;
      height: 29px;
      // background: url("./line.png") no-repeat;
      background-image: radial-gradient(
        1px 15px at center center,
        #c8c8c8,
        #f3f3f3
      );
      background-size: contain;
      position: absolute;
      left: 0;
    }
  }

  // 占位元素
  .wrap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
}
</style>
