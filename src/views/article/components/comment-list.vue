<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell
        v-for="(comment, index) in list"
        :key="index"
        :title="comment.content"
      >
      </van-cell> -->
      <CommentItem
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      ></CommentItem>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: { CommentItem },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limit: 10 // 每页大小
    }
  },
  props: {
    // 如果获取文章评论，则传递文章 id
    // 如果获取评论回复，则传递评论 id
    source: {
      type: [ Number, String, Object ],
      require: true
    },
    // 获取文章的评论 'a'，获取评论的回复 'c'
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      // 数组或对象的的默认值必须通过函数返回
      default: () => []
    }
  },
  methods: {
    async onLoad() {
      // 请求获取数据
      const { data } = await getComments({
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 每页大小
      })
      // 将评论数传递给父组件
      this.$emit('update-total-count', data.data.total_count)
      // 把数据放到列表中
      const { results } = data.data
      this.list.push(...results)

      // 关闭 loading
      this.loading = false
      // 判断是否还有数据，改变 finished
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
