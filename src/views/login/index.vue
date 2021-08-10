<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!--
      基于Vant的表单验证:
      1、使用van-form组件包裹所有的表单项van-field
      2、给van-form绑定submit事件
        当表单提交的时候会触发submit事件
        提示:只有表单验证通过，它才会调用submit
      3、使用 Field 的 rules 属性定义校验规则
     -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        center
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        center
        name="code"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="mini"
            round
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '17090086870', // 手机号
        code: '246810' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false // 发送验证码按钮的 loading 状态
    }
  },
  methods: {
    async onLogin() {
      // Toast.loading({
      this.$toast.loading({
        message: '登录中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })

      // 1．找到数据接口
      // 2．封装请求方法
      // 3．请求调用登录
      try {
        const { data } = await login(this.user)
        // 4．处理响应结果
        this.$toast.success('登录成功')
        // 存储登录信息
        this.$store.commit('SETUSER', data.data)
        // 登录成功，跳转回原来页面
        this.$router.back()
      } catch (error) {
        console.log(error)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },

    onFailed(error) {
      console.log(error)
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 提示消息的位置
        })
      }
    },

    async onSendSms() {
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 按钮进入 loading 状态，防止网络慢时多次点击
        this.isSendSmsLoading = true
        // 验证通过，请求发送验证码
        await sendSms(this.user.mobile)
        // 短信发送出去了，隐藏按钮，显示倒计时
        this.isCountDownShow = true
      } catch (error) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示
        let message = ''
        if (error && error.response && error.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (error.name === 'mobile') {
          // 表单验证失败的错误提示
          message = error.message
        } else {
          // 未知错误
          message = '发送错误，请稍后重试'
        }
        // 提示用户
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 无论发送成功还是失败，都需要关闭 loading 状态
      this.isSendSmsLoading = false
      // 校验手机号码
      // 验证通过 -> 请求发送验证码 -> 用户接收短信 ->
      // 输入验证码 -> 请求登录
      // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
      // 倒计时结束 -> 隐藏倒计时，显示发送按钮
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }

  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #71abdd;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
