<template>
  <div class="article-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <ArticleItem
        v-for="(article, index) in articles"
        :key="index"
        :article="article"
      ></ArticleItem>
    </van-list>
  </div>
</template>

<script>
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    fn: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      articles: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      try {
        const { data } = await this.fn({
          page: this.page,
          perPage: this.perPage
        })
        const { results } = data.data
        this.articles.push(...results)
        // 加载状态结束
        this.loading = false

        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }

      // 数据全部加载完成
      } catch (error) {
        this.$toast.fail('数据请求失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
