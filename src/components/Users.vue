<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索 -->
    <div class="search">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select" @input.native="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeType(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="delOne(scope.row)"
          ></el-button>
          <el-button type="success" size="mini" plain>
            <i class="el-icon-setting"></i>分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagesize: 2,
      pagenum: 1,
      query: '',
      tableData: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取列表
    async getUserList () {
      try {
        const { data } = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        this.tableData = data.users
        this.total = data.total
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 删除一条
    async delOne (item) {
      const id = item.id
      try {
        await this.$confirm('是否确认删除此用户？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        console.log(meta)
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message({
            type: 'warning',
            message: `删除失败! ${meta.msg}`
          })
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 修改用户状态
    async changeType (item) {
      const { id, mg_state } = item
      try {
        await this.$axios.put(`users/${id}/state/${mg_state}`)
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 搜索
    search () {
      console.log(this.tableData)
      this.pagenum = 1
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" >
// scoped
.el-breadcrumb {
  height: 40px;
  line-height: 40px !important;
  border-bottom: 1px solid #999;
  margin-bottom: 10px;
  font-size: 14px;
}
.el-table {
  margin-top: 10px;
}
.search {
  @include flex(center, flex-start);
  .el-input-group {
    width: 300px;
    margin-right: 20px;
  }
}
.el-pagination{
  margin-top: 10px;
}
</style>
