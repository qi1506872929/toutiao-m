<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true // 禁止背景点击
      })
      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 请求提交更新用户生日
      await updateUserProfile({
        birthday: date
      })
      this.$toast.success('保存成功')
      // 修改父组件生日
      this.$emit('input', date)
      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .van-picker__cancel,
/deep/ .van-picker__confirm {
  color: #1989fa;
  font-size: 14px;
}
</style>
