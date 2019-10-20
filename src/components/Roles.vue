<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
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
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    async  getTableList () {
      const { meta, data } = await this.$axios.get('roles')
      console.log(meta, data)
      if (meta.status === 200) {
        this.tableData = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRights (rightId, row) {
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success('取消权限成功')
        console.log(data)
        row.children = data
      } else {
        this.$message.error(meta.msg)
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
</style>
