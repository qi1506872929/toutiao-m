<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 读取图片信息 -->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />

    <!-- cell 选项 -->
    <van-cell-group>
      <van-cell title="头像" is-link center @click="$refs.file.click()">
        <van-image width="30" height="30" round fit="cover" :src="user.photo" />
      </van-cell>
      <van-cell
        title="昵称"
        :value="user.name"
        is-link
        @click="isEditNameShow = true"
      />
      <van-cell
        title="性别"
        :value="user.gender ? '女' : '男'"
        is-link
        @click="isEditGenderShow = true"
      />
      <van-cell
        title="生日"
        :value="user.birthday"
        is-link
        @click="isEditBirthdayShow = true"
      />
    </van-cell-group>

    <!-- 修改昵称的弹出层 -->
    <van-popup
      class="cell-name-wrap"
      v-model="isEditNameShow"
      position="bottom"
    >
      <!-- :name="user.name" @update-name="user.name = $event" -->
      <!-- v-model="user.name" = :value="user.name" @input="user.name = $event" -->
      <UpdateName
        v-model="user.name"
        v-if="isEditNameShow"
        @close="isEditNameShow = false"
      ></UpdateName>
    </van-popup>

    <!-- 修改性别的弹出层 -->
    <van-popup
      class="cell-gender-wrap"
      v-model="isEditGenderShow"
      position="bottom"
    >
      <UpdateGender
        v-model="user.gender"
        v-if="isEditGenderShow"
        @close="isEditGenderShow = false"
      ></UpdateGender>
    </van-popup>

    <!-- 修改生日的弹出层 -->
    <van-popup
      class="cell-birthday-wrap"
      v-model="isEditBirthdayShow"
      position="bottom"
    >
      <UpdateBirthday
        v-model="user.birthday"
        v-if="isEditBirthdayShow"
        @close="isEditBirthdayShow = false"
      ></UpdateBirthday>
    </van-popup>

    <!-- 修改头像的弹出层 -->
    <van-popup
      class="cell-photo-wrap"
      v-model="isEditPhotoShow"
      position="bottom"
    >
      <UpdatePhoto
        :file="previewImage"
        v-if="isEditPhotoShow"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      ></UpdatePhoto>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  data() {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称的显示状态
      isEditGenderShow: false, // 编辑性别的显示状态
      isEditBirthdayShow: false, // 编辑生日的显示状态
      isEditPhotoShow: false, // 编辑头像的显示状态
      previewImage: null // 上传预览图片
    }
  },
  methods: {
    async loadUserProfile() {
      // 请求数据
      const { data } = await getUserProfile()
      this.user = data.data
    },
    // 切换头像事件
    onFileChange() {
      // 展示弹出层
      this.isEditPhotoShow = true
      // 在弹出层预览图片
      // const image = window.URL.createObjectURL(this.$refs.file.files[0])
      const file = this.$refs.file.files[0]
      this.previewImage = file
      // 为了避免选择相同文件不触发 change 事件，所有手动清空数据
      this.$refs.file.value = ''
    }
  },
  created() {
    this.loadUserProfile()
  }
}
</script>

<style lang='less' scoped>
.cell-name-wrap {
  background-color: #f5f7f9;
  height: 100%;
}
.cell-gender-wrap {
  height: 40%;
}
.cell-birthday-wrap {
  height: 40%;
}
.cell-photo-wrap {
  height: 100%;
  background-color: #000;
}
</style>
