import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import vuetify from './plugins/vuetify';
import firebaseConfig from "./firebase-config";

Vue.config.productionTip = false;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ここに含めたパッケージは、this.$XXXで利用可能
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
