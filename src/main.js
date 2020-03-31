import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

// firebaseのコンフィグ TODO:今後はhostingURLを利用したい
const firebaseConfig = {
  apiKey: "AIzaSyCJv9rgteA7J72JsDnxmJmlg7BDMIPgWIg",
  authDomain: "color-record-test.firebaseapp.com",
  databaseURL: "https://color-record-test.firebaseio.com",
  projectId: "color-record-test",
  storageBucket: "color-record-test.appspot.com",
  messagingSenderId: "1047522148283",
  appId: "1:1047522148283:web:2861562b5a158cec2cce9e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ここに含めたパッケージは、this.$XXXで利用可能
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
