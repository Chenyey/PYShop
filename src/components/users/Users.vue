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
      <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
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
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="showEdit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="delOne(scope.row)"
          ></el-button>
          <el-button type="success" @click="showRoles(scope.row)" size="mini" plain>
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
    <!-- 添加用户 -->
    <el-dialog title="添加用户" @closed='closeDialog' :visible.sync="addDialog" width="40%">
      <el-form ref="addForm"  :rules="rules" :model="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="添加用户" :visible.sync="editDialog" width="40%">
      <el-form ref="editForm"  :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="showEditrRoles" width="40%">
      <el-form ref="rolesForm"  :model="rolesForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{rolesForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="rolesForm.rid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditrRoles = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
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
      total: 0,
      addDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialog: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 6, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          // 正则验证
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      showEditrRoles: false,
      rolesForm: {
        id: '',
        username: '',
        rid: ''
      },
      rolesList: []
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
        this.$message.success('修改状态成功')
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 搜索
    search () {
      console.log(this.tableData)
      this.pagenum = 1
      this.getUserList()
    },
    // 显示添加框
    showAddDialog () {
      this.addDialog = true
    },
    // 添加用户
    async addUser () {
      try {
        await this.$refs['addForm'].validate()
        const { meta } = await this.$axios.post('users', this.addForm)
        if (meta.status === 201) {
          // 提示信息
          this.$message.success('添加成功')
          // 关闭对话框
          this.addDialog = false
          // 调整页码
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 刷新页面
          this.getUserList()
        } else {
          // console.log(meta)
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 关闭弹窗时候清除输入的文字
    closeDialog () {
      this.$refs['addForm'].resetFields()
    },
    // 显示修改框
    showEdit (row) {
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editDialog = true
    },
    // 修改用户
    async editUser () {
      try {
        await this.$refs['editForm'].validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success('修改成功')
          // 关闭对话框
          this.editDialog = false
          // 重新渲染列表
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 显示分配角色
    async showRoles (row) {
      try {
        this.showEditrRoles = true
        this.rolesForm.id = row.id
        this.rolesForm.username = row.username
        // 根据id获取原有的角色
        const resUser = await this.$axios.get(`users/${row.id}`)
        if (resUser.meta.status === 200) {
          const rid = resUser.data.rid
          this.rolesForm.rid = rid === -1 ? '' : rid
        } else {
          this.$message.error(resUser.meta.msg)
        }
        // 显示角色列表
        const { data, meta } = await this.$axios.get('roles')
        if (meta.status === 200) {
          this.rolesList = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 分配角色
    async editRoles () {
      try {
        const { id, rid } = this.rolesForm
        const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.showEditrRoles = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
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
.el-dialog .el-from-item{
  margin-bottom: 20px;
}
</style>
