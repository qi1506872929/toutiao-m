<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <van-icon name="weapp-nav" size="18" />
      </template>
    </van-nav-bar>

    <div class="article-wrap">
      <!-- 文章标题 -->
      <h2 class="title">{{ article.title }}</h2>

      <!-- 作者信息 -->
      <van-cell class="user-info" center>
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image class="avatar" slot="icon" round :src="article.aut_photo" />
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          class="follow-btn"
          :icon="article.is_followed ? '' : 'plus'"
          :type="article.is_followed ? 'default' : 'info'"
          round
          size="small"
          :loading="isFollowLoading"
          @click="onFollow"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>

      <!-- 文章信息 -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>

      <!-- 文章评论 -->
      <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      ></comment-list>
    </div>

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
      <van-icon
        class="comment-icon"
        name="comment-o"
        :info="totalCommentCount <= 999 ? totalCommentCount : '999+'"
        color="#777"
      />
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        :target="articleId"
        @post-success="PostSuccess"
      ></PostComment>
    </van-popup>

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <!-- 使用 v-if 控制弹出层的渲染和销毁，放置加载过的组建部重新渲染导师数据不重新渲染 -->
      <CommentReply
        v-if="isReplyShow"
        :comment="replyComment"
        :articleId="articleId"
        @close="isReplyShow = false"
      ></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: { CommentList, PostComment, CommentReply },
  props: {
    articleId: {
      type: [ String, Number, Object ],
      require: true
    }
  },
  data() {
    return {
      article: {},
      isFollowLoading: false, // 关注用户按钮的 loading 状态
      isPostShow: false, // 控制写评论弹出框的状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 文章评论数
      isReplyShow: false, // 控制回复的显示状态
      replyComment: {} // 当前回复评论对象
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    // 加载文章数据
    async loadArticle() {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      // 点击图片展示
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },
    // 点击图片展示
    handlePerviewImage() {
      // 获取文章内容 Dom 容器
      const articleContent = this.$refs['article-content']
      // 得到所有的 img 标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = [] // 搜集图片路径
      // 循环 img 列表，给 img 注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        // 在事件处理函数中调用 ImagePreview() 预览
        img.onclick = function() {
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index // 起始位置
          })
        }
      })
    },
    // 点击关注按钮触发事件
    async onFollow() {
      this.isFollowLoading = true // 按钮进入加载状态
      if (this.article.is_followed) {
        // 已关注，取消关注
        await deleteFollow(this.article.aut_id)
      } else {
        // 未关注，添加关注
        await addFollow(this.article.aut_id)
      }
      // 改变按钮状态
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false // 按钮结束加载状态
    },
    // 点击收藏按钮触发事件
    async onCollect() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId)
      } else {
        // 未收藏，添加收藏
        await addCollect(this.articleId)
      }
      // 改变按钮状态
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    // 点击点赞按钮触发事件
    async onLike() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.attitude === 1) {
        // 已点赞，取消点赞
        await deleteLike(this.articleId)
      } else {
        // 未点赞，添加点赞
        await addLike(this.articleId)
      }
      // 改变按钮状态
      this.article.attitude = this.article.attitude === 1 ? 0 : 1
      this.$toast.success(
        `${this.article.attitude === 1 ? '' : '取消'}点赞成功`
      )
    },
    // 发布评论成功触发事件
    PostSuccess(comment) {
      // 把发布成功的评论数据对象放入评论列表顶部
      this.commentList.unshift(comment)
      // 关闭发布评论弹框
      this.isPostShow = false
      // 评论数加一
      this.totalCommentCount++
    },
    // 点击回复按钮触发事件
    onReplyClick(comment) {
      // 展示回复内容
      this.isReplyShow = true
      this.replyComment = comment
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  .article-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 44px;
    top: 46px;
    overflow-y: auto;

    .title {
      font-size: 20px;
      color: #3a3a3a;
      padding: 24px 20px 18px;
      background-color: #fff;
      margin: 0;
    }

    .user-info {
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .name {
        font-style: 12px;
        color: #333333;
        line-height: 1;
      }
      .pubdate {
        font-size: 11px;
        color: #b4b4b4;
        line-height: 1;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }

    // ul {
    //   list-style: unset;
    // }

    .markdown-body {
      padding: 14px;
      background-color: #fff;
    }
  }

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
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
    .comment-icon {
      bottom: -2px;
    }
  }
}
</style>
