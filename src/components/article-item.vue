<template>
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l3">
      {{ article.title }}
    </div>
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div
          v-for="(img, index) in article.cover.images"
          :key="index"
          class="cover-wrap-item"
        >
          <van-image class="cover-item" :src="img" />
        </div>
      </div>
      <div class="label-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.collect_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      class="right-cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__title{
      width: 100%;
      word-break: break-all;
  }
  /deep/ .van-cell__value {
    flex: unset;
    margin-left: 12px;
  }
  .right-cover {
    width: 116px;
    height: 73px;
  }

  .cover-wrap {
    display: flex;
    padding: 15px 0;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      // 排除掉最后一个父元素
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item {
        width: 116px;
        height: 73px;
      }
    }
  }

  .label-wrap {
      height: 11px;
      color: #b4b4b4;
      span {
          margin-right: 12px;
      }
  }
}
</style>
