<template>
  <div class="login">
    <el-form
      ref="form"
      class="login-form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="isLogin"
          @click="onSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771', // 18201288771
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      isLogin: false
    }
  },

  methods: {
    async onSubmit () {
      this.isLogin = true
      try {
        await (this.$refs.form as Form).validate()
        const { data } = await login(this.form)
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('user/setUser', data.content)
          this.$router.push(this.$route.query.redirect as string || '/')

          this.$message.success('登录成功')
        }
      } catch (error) {
        console.log('error', error)
        this.$message.error('登录失败')
      }

      this.isLogin = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
