<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页数
      perPage: 10 // 每页数量
    }
  },
  methods: {
    async onLoad() {
      // 请求数据
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页数量
        q: this.searchText // 搜索关键词
      })
      // 存储数据
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      if (results.length) {
        // 加载下一页数据
        this.page++
      } else {
        // 数据全部加载完成
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>
