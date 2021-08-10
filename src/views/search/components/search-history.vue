<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span style="margin-right: 10px;" @click="$emit('update-histories', [])">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="onDelete(history, index)"
    >
      <van-icon name="close" v-show="isDeleteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from '@/utils/storage'

export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  methods: {
    onDelete(history, index) {
      // 如果是删除状态，执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 删除本地数据和线上的数据(无法删除线上，无接口)
        // setItem('search-histories', this.searchHistories)
        return
      }
      // 非删除状态，展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style lang="less" scoped></style>
