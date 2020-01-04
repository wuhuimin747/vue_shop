/* eslint-disable keyword-spacing */
/* eslint-disable semi */
<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 登录头像 -->
            <div class="avater_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFromRef" v-bind:model="loginForm" v-bind:rules="loginFormRules" label-width="0" class="login_form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    resetForm () {
      // this表示Login组件实例对象，this.$refs是组件实例的引用变量合集，resetFields是elementui的重置表单的方法
      this.$refs.loginFromRef.resetFields();
    },
    login () {
      // 登录请求发送前的表单预验证
      this.$refs.loginFromRef.validate(async (res, field) => {
        // console.log(res, field)
        // 验证通过后执行异步操作
        if (!res) return;
        const result = await this.axios.post('login', this.loginForm);
        const data = result.data;
        if (data.meta.status === 200) {
          this.$message.success('登录成功');
          // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
          window.sessionStorage.setItem('token', data.data.token);
          // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
          this.$router.push('/home');
        } else {
          this.$message.error('登录失败');
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.login_container{
    background-color:#2b4b6b;
    height: 100%;

    .login_box{
        width: 500px;
        height: 300px;
        background-color: white;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avater_box{
            width: 130px;
            height: 130px;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            background-color: #fff;
            padding: 10px;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
