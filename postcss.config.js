/*
    PostCSS 的配置文件
    PostCSS 是基于 Node.js 运行的一个处理 CSS 的工具
    所以它的配置文件也是运行在 Node.js 中
*/

// PostCSS 配置文件需要导出一个对象
module.exports = {
  // 配置要使用而相关插件
  plugins: {
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把 px 转为 rem
    'postcss-pxtorem': {
      // 转换的根元素基准值
      rootValue: 37.5,
      //   需要转换的所有属性
      propList: ['*']
    }
  }
}
