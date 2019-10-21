<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="success" plain @click="showAdd">添加角色</el-button>
    <!-- 表格 -->
    <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template v-slot:default = "{ row }">
            <el-row class="l1" v-for="l1 in row.children" :key='l1.id'>
              <el-col :span="4">
                <el-tag closable @close='delRights(l1.id,row)' >{{ l1.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row class="l2"  v-for="l2 in l1.children" :key='l2.id'>
                  <el-col :span="4">
                    <el-tag closable type='success' @close='delRights(l2.id,row)'>{{ l2.authName }}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag @close='delRights(l3.id,row)' class="l3" v-for="l3 in l2.children" closable type='warning' :key="l3.id">{{ l3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="描述"
          prop="roleDesc">
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot:default="obj">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="showEdit(obj.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="delOne(obj.row.id)"
            ></el-button>
            <el-button type="success" size="mini" @click="showDistribution(obj.row)" plain>
              <i class="el-icon-setting"></i>分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加用户 -->
      <el-dialog @closed='closeDialog' :title="dialogText" :visible.sync="addDialog" width="40%">
        <el-form ref="rolesForm"  :rules="rules" :model="rolesForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog title="分配权限" :visible.sync="showDistributionBox" width="40%">
        <el-tree
          :data="data"
          show-checkbox
          default-expand-all
          node-key="id"
          ref = 'tree'
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDistributionBox = false">取 消</el-button>
          <el-button type="primary" @click="distribution">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      data: [],
      addDialog: false,
      dialogText: '添加角色',
      rolesForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      showDistributionBox: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      currentId: ''
    }
  },
  async created () {
    this.getTableList()
  },
  methods: {
    // 获取数据列表
    async  getTableList () {
      try {
        const { meta, data } = await this.$axios.get('roles')
        // console.log(meta, data)
        if (meta.status === 200) {
          this.tableData = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 删除权限
    async delRights (rightId, row) {
      try {
        const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
        if (meta.status === 200) {
          this.$message.success('取消权限成功')
          console.log(data)
          row.children = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 显示添加弹窗
    showAdd () {
      this.addDialog = true
      this.dialogText = '添加角色'
    },
    // 显示修改弹窗
    showEdit (row) {
      this.addDialog = true
      this.dialogText = '修改角色'
      // 存放正在修改的ID

      // 数据的回显
      // 有bug  数据的回显快过页面的渲染，导致elementui以为有数据的就是默认的
      this.$nextTick(() => {
        this.rolesForm.id = row.id
        this.rolesForm.roleName = row.roleName
        this.rolesForm.roleDesc = row.roleDesc
      })
    },
    // 关闭弹窗
    closeDialog () {
      this.$refs.rolesForm.resetFields()
    },
    // 确定删除/修改
    async submit () {
      try {
        await this.$refs.rolesForm.validate()
        const isAdd = this.dialogText === '添加角色'
        const type = isAdd ? 'post' : 'put'
        const address = isAdd ? 'roles' : `roles/${this.rolesForm.id}`
        const { meta } = await this.$axios[type](address, this.rolesForm)

        if (meta.status === 200 || meta.status === 201) {
          this.$message.success(meta.msg)
          // 隐藏弹窗
          this.addDialog = false
          this.getTableList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 删除角色
    async delOne (id) {
      try {
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          this.getTableList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 显示分配权限弹窗
    async showDistribution (row) {
      this.showDistributionBox = true
      this.currentId = row.id
      // 获取权限列表
      try {
        const { data, meta } = await this.$axios.get('rights/tree')
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.data = data

          const ids = []

          row.children.forEach(l1 => {
            l1.children.forEach(l2 => {
              l2.children.forEach(l3 => {
                ids.push(l3.id)
              })
            })
          })
          this.$refs.tree.setCheckedKeys(ids)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 修改权限
    async distribution () {
      try {
        const rights = this.$refs.tree.getCheckedKeys().join(',')
        const { meta } = await this.$axios.post(`roles/${this.currentId}/rights`, { rids: rights })
        if (meta.status === 200) {
          this.$message.success('更新授权成功')
          this.showDistributionBox = false
          this.getTableList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(external)
      }
    }
  }
}
</script>

<style lang="scss">
.l1{
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dotted #999
}
.l2{
  padding-bottom: 8px;
}
.l3{
  margin-bottom: 8px;
  margin-right: 8px;
}
.el-dialog__body{
  height: 300px;
  overflow-y: auto
}
</style>
