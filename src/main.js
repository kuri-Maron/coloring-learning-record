import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store/index";

Vue.config.productionTip = false;

// ここに含めたパッケージは、this.$XXXで利用可能
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
