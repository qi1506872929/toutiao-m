module.exports = {
  lintOnSave: false, // 禁用eslint
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    proxy: {
      '/api': {
        // target: "http://182.92.128.115",
        target: 'http://ttapi.research.itcast.cn',
        // target: "http://localhost:8001",
        pathRewrite: {
          '^/api': ''
        }
      },
      '/api1': {
        target: 'wss://echo.websocket.org',
        changOrigin: true, // 开启代理
        ws: false,
        pathRewrite: {
          '^/api1': ''
        }
      }
    }
  },
  runtimeCompiler: true
}
