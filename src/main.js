import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/axios";
import "@/assets/css/reset.css"
import "@/element-ui"
import "@/element-ui/changeElementStyle.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
