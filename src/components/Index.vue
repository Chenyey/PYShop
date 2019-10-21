<template>
  <el-container>
    <el-aside width="200px">
      <div class="logo">
        <img src="../assets/logo1.png" alt="" srcset="">
      </div>
      <el-menu
        :default-active="current"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.authName}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="nav in item.children" :key="nav.id" :index="nav.path"><i class="el-icon-location"></i>{{nav.authName}}</el-menu-item>
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
  async created () {
    try {
      const { data, meta } = await this.$axios.get('menus')
      console.log(data, meta)
      if (meta.status === 200) {
        this.menuList = data
      } else {
        this.$message.error(meta.msg)
      }
    } catch (e) {
      this.$message.error(e)
    }
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
  },
  computed: {
    current () {
      return this.$route.path.slice(1)
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
