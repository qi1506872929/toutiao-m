<template>
  <div class="user-follow">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar" left-arrow @click-left="$router.back()">
      <van-tabs
        v-model="active"
        slot="title"
        background="#3296fa"
        color="#fff"
        title-active-color="#fff"
        title-inactive-color="#fff"
        line-width="60px"
        swipeable
      >
        <van-tab title="关注" :to="`/user/${userId}/follow`" replace>
          <FollowList></FollowList>
        </van-tab>
        <van-tab
          title="粉丝"
          :to="`/user/${userId}/follow?tab=followers`"
          replace
        >
          <FollowList followers></FollowList>
        </van-tab>
      </van-tabs>
    </van-nav-bar>
  </div>
</template>

<script>
import FollowList from './components/follow-list'

export default {
  name: 'UserFollow',
  components: { FollowList },
  props: {
    userId: {
      type: [ Number, String, Object ],
      require: true
    }
  },
  data() {
    return {
      active: this.$route.query.tab === 'followers' ? 1 : 0
    }
  }
}
</script>

<style lang='less' scoped>
.user-follow {
  /deep/ .van-nav-bar__title {
    width: 60%;
  }
}
</style>
