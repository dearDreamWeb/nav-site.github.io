import Vue from "vue"
import axios from 'axios'
//  你也可以创建一个实例，然后在实例中配置相关属性,如下：
const http = axios.create({
    // baseURL:baseURL , 		      // 后台服务地址  这里写上自己的默认的url，例如www.csdn.com或者http://localhost:3000
    timeout: 60000, 		      // 请求超时时间1分钟
    // responseType: "json",
    withCredentials: false    // 是否允许带cookie这些
});
Vue.prototype.$axios = http;