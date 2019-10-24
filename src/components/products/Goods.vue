<template>
  <div class="product">
    <el-button plain type="success" @click="toAdd">添加商品</el-button>
    <el-table :data="productList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品数量" prop="goods_number"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default={row}>
          {{row.add_time | toTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" circle plain icon="el-icon-edit"></el-button>
          <el-button type="danger" circle plain icon="el-icon-delete"></el-button>
        </template>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      productList: [],
      Pnp: '',
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取商品列表
    async getList () {
      try {
        const { data, meta } = await this.$axios.get('goods', {
          params: {
            Pnp: this.Pnp,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        if (meta.status === 200) {
          this.productList = data.goods
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 分页
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getList()
    },
    // 设置序号
    indexMethod (index) {
      return (index + 1) + (this.pagenum - 1) * this.pagesize
    },
    // 添加商品跳转
    toAdd () {
      this.$router.push({ name: 'goods-add' })
    }
  }
}
</script>
<style lang="scss">

</style>
