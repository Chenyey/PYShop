<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      width="180">
    </el-table-column>
    <el-table-column
      prop="level"
      label="层级">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        authName: '',
        path: '',
        level: ''
      }]
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('rights/list')
    if (meta.status === 200) {
      this.tableData = data
      // this.$message.success('获取权限列表成功')
    } else {
      this.$message.error(meta.msg)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
