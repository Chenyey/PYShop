<template>
  <div class="categories">
    <el-button type="success" plain @click="showaddCategory">添加分类</el-button>
    <el-table :data="categortyList" row-key="cat_id" v-loading="loading">
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default='{ row }'>
          <el-tag type="info">{{row.cat_deleted === false ? '有效' : '无效'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" size="mini" plain circle icon="el-icon-edit"></el-button>
        <el-button type="warning" size="mini" plain circle icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  <!-- 添加的弹窗 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialog"
      width="40%"
      @closed ="clear">
      <el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="catName">
          <el-input v-model="addForm.catName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item prop="cat_pid">
          <el-cascader
              v-model="addForm.cat_pid"
              :options="options"
              :props="props"
              clearable
              @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      categortyList: [],
      loading: false,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addDialog: false,
      addForm: {
        catName: '',
        cat_pid: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      rules: {
        catName: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取列表
    async getCateList () {
      try {
        this.loading = true
        const { data, meta } = await this.$axios.get('categories', {
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        console.log(data)
        if (meta.status === 200) {
          this.total = data.total
          this.categortyList = data.result
          this.loading = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 显示添加
    async showaddCategory () {
      // 获取分类数据
      try {
        this.addDialog = true
        const { data, meta } = await this.$axios.get('categories?type=2')
        if (meta.status === 200) {
          this.options = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 级联
    handleChange (value) {
      console.log(value)
    },
    // 添加
    async addCategory () {
      try {
        await this.$refs.addForm.validate()
        const { catName, cat_pid } = this.addForm
        const catParid = cat_pid.slice(cat_pid.length - 1)[0] || 0
        const { meta } = await this.$axios.post('categories', {
          cat_name: catName,
          cat_pid: catParid,
          cat_level: cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialog = false
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 关闭时清空
    clear () {
      this.$refs.addForm.resetFields()
    },
    // 分页
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCateList()
    }

  }
}
</script>

<style lang="scss">

</style>
