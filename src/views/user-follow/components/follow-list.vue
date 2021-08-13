<template>
  <div class="follow-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(item, index) in list" :key="index" center>
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="item.photo"
        />
        <div slot="title" class="title-wrap">
          <div class="name">{{ item.name }}</div>
          <div>
            <span class="follow-count">粉丝数：{{ item.fans_count }}</span>
          </div>
        </div>
        <div v-if="$route.query.tab !== 'followers'">
          <van-button
            :type="item.is_followed ? 'default' : 'danger'"
            size="small"
            @click="onChangeFollow(item)"
            >{{
              item.is_followed ? (item.mutual_follow ? "相互关注" : "已关注") : "关注"
            }}</van-button
          >
        </div>
        <div v-else>
          <van-button
            :type="item.is_followed ? 'default' : 'danger'"
            size="small"
            @click="onChangeFollow(item)"
            >{{
              item.is_followed ? (item.mutual_follow ? "相互关注" : "已关注") : "关注"
            }}</van-button
          >
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getFollowersByUser, getFollowingsByUser, addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowList',
  props: {
    // 默认获取用户关注列表，如果需要获取粉丝列表则指定 followers 为 true
    followers: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  methods: {
    async onLoad() {
      try {
        const params = [
          this.$route.params.userId,
          {
            page: this.page,
            perPage: this.perPage
          }
        ]
        // 请求数据
        const { data } = await (this.followers
          ? getFollowersByUser(...params)
          : getFollowingsByUser(...params)
        )
        const { results } = data.data
        results.forEach(item => {
          item.is_followed = true
        })
        this.list.push(...results)
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async onChangeFollow(item) {
      if (item.is_followed) {
        await deleteFollow(item.id)
      } else {
        await addFollow(item.id)
      }
      item.is_followed = !item.is_followed
    }
  }
}
</script>

<style lang='less' scoped>
.follow-list {
  position: fixed;
  right: 0;
  left: 0;
  top: 46px;
  bottom: 0;
  overflow-y: auto;

  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }

  .title-wrap {
    text-align: left;
    .name {
      font-size: 14px;
    }
    .follow-count {
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>
