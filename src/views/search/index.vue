<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :searchText="searchText"></SearchResult>
    <!-- 联想建议 -->
    <SearchSuggestion v-else-if="searchText" :searchText="searchText" @search="onSearch"></SearchSuggestion>
    <!-- 搜索历史 -->
    <SearchHistory
        v-else
        :search-histories="searchHistories"
        @search="onSearch"
        @update-histories="searchHistories = $event"
    ></SearchHistory>
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data() {
    return {
      searchText: '', // 搜索关键词
      isResultShow: false, // 控制搜索结果的状态
      searchHistories: [] // 历史记录
    }
  },
  watch: {
    // 监视搜索历史记录的变化，存储到本地存储
    searchHistories() {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch(searchText) {
      // 根据联想更改搜索关键词
      this.searchText = searchText
      // 记录搜索历史记录
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        //   存在该关键词的历史记录，删除
        this.searchHistories.splice(index, 1)
      }
      // 将关键词存放在记录的顶部
      this.searchHistories.unshift(this.searchText)
      // 已登录，每次搜索后台自动记录，未登录，将记录存储到本地
      //   setItem('search-histories', this.searchHistories)

      // 展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHistories() {
      // 后端只存储四条数据，所以讲后台的和本地的数据合并
      const searchHistories = getItem('search-histories') || []
      // 如果用户已登录
      //   if (this.user) {
      //     const { data } = await getSearchHistories()
      //     searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      //   }
      this.searchHistories = searchHistories
    }
  },
  created() {
    this.loadSearchHistories()
  },
  computed: {
    ...mapState([ 'user' ])
  }
}
</script>

<style lang="less" scoped></style>
