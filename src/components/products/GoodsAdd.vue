<template>
  <div class="product-add">
    <div class="steps">
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="步骤1" description="填写基本信息"></el-step>
        <el-step title="步骤2" description="上传商品图片"></el-step>
        <el-step title="步骤3" description="完善商品内容"></el-step>
      </el-steps>
    </div>
    <div class="contents">
      <el-tabs v-model="activeTab" tab-position="left" @tab-click='handleClick'>
        <el-tab-pane label="基本信息" name='0'>
          <el-form ref="introduce" label-width="80px">
            <el-form-item label="商品名称">
              <el-input v-model="productForm.goods_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"><el-input v-model="productForm.goods_price" placeholder="请输入商品价格"></el-input></el-form-item>
            <el-form-item label="商品重量"><el-input v-model="productForm.goods_weight" placeholder="请输入商品重量"></el-input></el-form-item>
            <el-form-item label="商品数量"><el-input v-model="productForm.goods_number" placeholder="请输入商品数量"></el-input></el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
              v-model="productForm.goods_cat"
              :options="options"
              :props="prop"
              @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="1" :offset="19"><el-button type="primary" @click="nextStep">下一步</el-button></el-col>
          </el-row>

        </el-tab-pane>
        <el-tab-pane label="产品图片" name='1'>
          <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          name='file'
          list-type="picture-card"
          multiple
          :headers='headers'
          :on-success="successUploadPic"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          >
            <i slot="default" class="el-icon-plus"></i>
        </el-upload>
        <el-row :gutter="20">
            <el-col :span="1" :offset="19"><el-button type="primary" @click="nextStep">下一步</el-button></el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="产品内容" name='2'>
          <quill-editor v-model="productForm.goods_introduce"></quill-editor>
          <el-row :gutter="20" style="margin-top:20px">
            <el-col :span="2" :offset="18"><el-button type="primary" @click="addProduct">添加商品</el-button></el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <img style="max-width: 100%; max-height: 80%; margin:0 auto;display:block"  :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogImageUrl: '',
      dialogVisible: false,
      options: [],
      active: 0,
      activeTab: '0',
      prop: {
        label: 'cat_name',
        value: 'cat_id'
      }
    }
  },
  async created () {
    try {
      const { meta, data } = await this.$axios.get('categories?type=3')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    } catch (e) {
      this.$message.error(e)
    }
  },
  methods: {
    // 步骤切换
    handleClick (tab, event) {
      this.active = +tab.index
    },
    handleChange (value) {
      console.log(value)
    },
    // 下一步
    nextStep () {
      this.active++
      this.activeTab = String(this.active)
    },
    // 图片操作
    handleRemove (file) {
      // console.log(file)
      const path = file.response.data.tmp_path
      this.productForm.pics = this.productForm.pics.filter(item => item.pic !== path)
      console.log(this.productForm.pics)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    successUploadPic (response, file, fileList) {
      const { data, meta } = response
      if (meta.status === 200) {
        this.productForm.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加商品
    async addProduct () {
      try {
        // 验证
        if (this.productForm.goods_name.trim() === '') {
          this.$message.error('请输入商品名')
          return false
        } else if (!/^[1-9]\d{0,}$/.test(this.productForm.goods_price)) {
          this.$message.error('商品价格有误')
          return false
        } else if (!/^[1-9]\d{0,}$/.test(this.productForm.goods_weight)) {
          this.$message.error('商品重量有误')
          return false
        } else if (!/^\d{0,}$/.test(this.productForm.goods_number)) {
          this.$message.error('商品数量有误')
          return false
        } else if (this.productForm.goods_cat.length === 0) {
          this.$message.error('请选择分类')
          return false
        }
        const { meta } = await this.$axios.post('goods', {
          ...this.productForm,
          goods_cat: this.productForm.goods_cat.join(',')
        })
        if (meta.status === 201) {
          this.$message.success('创建商品成功')
          this.$router.push({ name: 'goods' })
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

<style lang="scss">
.steps{
  background: #fff;
  padding: 20px 0;
}
.contents{
  background: #fff;
  padding: 20px;
  margin-top: 5px;
}
.ql-container.ql-snow{
  height: 250px;
}

</style>
