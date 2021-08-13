<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/" name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/qa" name="search" icon="comment-o"
        >问答</van-tabbar-item
      >
      <van-tabbar-item to="/video" name="friends" icon="video-o"
        >视频</van-tabbar-item
      >
      <van-tabbar-item to="/my" name="setting" icon="manager-o">{{
        user ? "我的" : "未登录"
      }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  data() {
    return {
      active: 0
    }
  },
  computed: {
    ...mapState([ 'user' ])
  },
  mounted() {
    this.$store.commit('ADDCACHEPAGE', 'LayoutIndex')
  }
}
</script>

<style lang="less" scoped></style>
