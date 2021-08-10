<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      title="性别"
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: [ '男', '女' ],
      defaultIndex: this.value
    }
  },
  methods: {
    onGenderChange(picker, value, index) {
      this.defaultIndex = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true // 禁止背景点击
      })
      // 请求提交更新用户性别
      await updateUserProfile({
        gender: this.defaultIndex
      })
      this.$toast.success('保存成功')
      // 修改父组件性别
      this.$emit('input', this.defaultIndex)
      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .van-picker__cancel,
/deep/ .van-picker__confirm{
  color: #1989fa;
  font-size: 14px;
}
</style>
