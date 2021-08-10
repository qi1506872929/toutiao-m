<template>
  <div class="search-suggestion">
      <van-cell
        icon="search"
        v-for="(str, index) in suggestions"
        :key="index"
        @click="$emit('search', str)"
      >
        <div slot="title" v-html="highLight(str)"></div>
      </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议数据
    }
  },
  watch: {
    searchText: {
      immediate: true,
      handler: debounce(async function() {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200)
    }
  },
  methods: {
    highLight(str) {
      return str.replace(new RegExp(this.searchText, 'gi'), `<span style="color: red;">${this.searchText}</span>`)
    }
  }
}
</script>

<style lang='less' scoped>

</style>
