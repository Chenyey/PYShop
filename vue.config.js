// const path = require('path')
// const fs = require('fs')
module.exports = {
  devServer: {
    open: true,
    port: 8080
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/styles/style.scss";`
        // 需更改为项目中实际scss文件路径
        // resources: path.resolve(__dirname, './src/styles/style.scss'),
        // data: `@import "@/styles/style.scss";`
      //  data: fs.readFileSync('src/styles/style.scss', 'utf-8')
      }
    }
  }
}
