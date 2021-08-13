<template>
  <div class="my-article">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar" left-arrow @click-left="$router.back()" />
    <van-tabs v-model="active" color="#399afa" title-active-color="#3c9bfa" swipeable>
      <van-tab v-for="tab in tabs" :key="tab.title" :title="tab.title">
        <ArticleList :fn="tab.fn"></ArticleList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getUserCollectArticles, getUserHistoryArticles } from '@/api/article'

export default {
  name: 'MyArticle',
  components: { ArticleList },
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      active: this.getInitialActive(),
      tabs: [
        {
          title: '收藏',
          fn: getUserCollectArticles
        },
        {
          title: '历史',
          fn: getUserHistoryArticles
        }
      ]
    }
  },
  methods: {
    getInitialActive() {
      const active = [ 'collect', 'history' ].indexOf(this.type)
      return active !== -1 ? active : 0
    }
  }
}
</script>

<style lang='less' scoped>
</style>
