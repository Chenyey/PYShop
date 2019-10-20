<template>
  <div class="login">
    <el-form :rules="rules" status-icon ref="form" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt srcset />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" @keyup.enter.native='login'></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" @keyup.enter.native='login' type="password"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-row>
          <el-col :span="6">
            <el-button type="primary" class="login-btn" @click="login">登录</el-button>
          </el-col>
          <el-col :span="6" style="color:#fff">11111</el-col>
          <el-col :span="6">
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        console.log(data)
        localStorage.setItem('token', data.token)
        if (meta.status === 200) {
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          })
          this.$router.push({ name: 'index' })
        } else {
          this.$message({
            message: '用户名或者密码错误',
            type: 'warning',
            duration: 1000
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;
  form {
    width: 400px;
    background: #fff;
    margin: 200px auto 0;
    padding: 75px 20px 20px;
    position: relative;
    border-radius: 20px;
    img {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 5px solid #fff;
    }
    .el-input__prefix,
    .el-input__suffix {
      color: green !important;
    }
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>
