module.exports = {
  publicPath: "./",
  // 高德API配置
  configureWebpack(config) {
    config.externals = {
      AMap: "AMap" // 高德地图配置
    };
  },
  //修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "轩辕导航";
      return args;
    });
  },
  devServer: {
    proxy: {
      "http://images.frontendjs.com": {
        target: "http://images.frontendjs.com",
        changeOrigin: true
      }
    }
  }
};
