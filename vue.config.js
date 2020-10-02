module.exports = {
    publicPath: './',
    // 高德API配置
    configureWebpack(config) {
        config.externals = {
            'AMap': 'AMap' // 高德地图配置
        }
    },
    devServer: {
        proxy: {
            '/articles': {
                target: 'https://www.csdn.net/api/articles',
                changeOrigin: true,
            }
        }
    }
}