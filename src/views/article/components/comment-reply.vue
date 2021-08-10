<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>

    <!-- 当前评论项 -->
    <CommentItem :comment="comment"></CommentItem>

    <!-- 所有评论回复 -->
    <van-cell title="所有回复" />
    <CommentList
      :source="comment.com_id"
      type="c"
      :list="commentList"
    ></CommentList>

    <!--底部区域-->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>

    <!-- 发布回复 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        :target="comment.com_id"
        :articleId="articleId"
        @post-success="onPostSuccess"
      ></PostComment>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  components: { CommentItem, CommentList, PostComment },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [ Number, String, Object ],
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSuccess(comment) {
      // 将发布成功的评论放到评论列表的顶部
      this.commentList.unshift(comment)
      // 更新评论的回复数量
      this.comment.reply_count++
      // 关闭回复的弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style lang='less' scoped>
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 30px;
    color: #a7a7a7;
  }
}
</style>
