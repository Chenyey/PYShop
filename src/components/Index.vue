<template>
  <el-container>
    <el-aside width="200px">
      <div class="logo">
        <img src="../assets/logo1.png" alt="" srcset="">
      </div>
      <el-menu
        default-active=""
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router

      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="users"><i class="el-icon-location"></i>用户列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="roles"><i class="el-icon-location"></i>角色列表</el-menu-item>
            <el-menu-item index="rights"><i class="el-icon-location"></i>权限列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="goods"><i class="el-icon-location"></i>商品列表</el-menu-item>
            <el-menu-item index="params"><i class="el-icon-location"></i>分类参数</el-menu-item>
            <el-menu-item index="categories"><i class="el-icon-location"></i>商品分类</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="orders"><i class="el-icon-location"></i>订单列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>数据统计</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="orders"><i class="el-icon-location"></i>数据报表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <h4>清酒©销售管理系统</h4>
        <div>
          欢迎光临~
          <a href="javascript:void(0)" @click="exit">退出</a>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  created () {

  },
  methods: {
    exit () {
      this.$confirm('您确定退出系统吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$message({
          type: 'success',
          message: '退出系统成功'
        })
        this.$router.push({ name: 'login' })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" >
// scoped
// @import '../styles/style.scss';
.el-container{
  height: 100%;
  background: $bgcolor;
  .el-aside{
    background: $color2
  }
  .logo{
    height: 60px;
    background: $color3;
    @include flex(center,flex-start);
    img{
      padding-left: 20px;
      height: 50px;
    }
  }
  .el-header{
    height: 60px;
    background-color: $color1;
    @include flex(center,space-between);
  }
  .el-menu {
    border-right: none;
  }
  .el-menu-item-group__title{
    padding: 0 !important;
  }
}
</style>
