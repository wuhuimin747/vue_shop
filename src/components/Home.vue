<template>
  <el-container class="homeContainer">
    <!-- 头部导航 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="200px">
        <el-menu unique-opened router :default-active="$route.path"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级导航 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级导航的模板 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item :index="'/' + child.path" v-for="child in item.children" :key="child.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{child.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      // 一级菜单id和icon的映射对象
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 强制跳转到登录页
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data : ret } = await this.axios.get('menus');
      if (ret.meta.status !== 200) return this.$message.error(ret.meta.msg);
      this.menuList = ret.data;
    }
  }
}
</script>
<style lang="less" scoped>
.homeContainer {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    margin-left: 10px;
    img {
      width: 50px;
      height: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  // 让菜单右边框线消失，避免对不齐
  .el-menu {
    border-right: none;
  }
}
.el-mian {
  background-color: #eaedf1;
}
// 让一级菜单的icon和文字有间距
.iconfont {
  margin-right: 10px;
}
</style>
