<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <!-- TODO: この丸出しのメニューをvuetifyのコンポーネント使用してレイアウト調整する -->
        <router-link class="linkFont" to="/">Home</router-link>|
        <router-link class="linkFont" to="/about">About</router-link>
      </div>
      <v-spacer></v-spacer>
      <!-- 認証機能コンポーネント -->
      <Authentication />
    </v-app-bar>

    <v-content>
      <!-- コンテナーを横に広げる -->
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <!-- metaにbottomが設定されているviewだけボトムバーを表示 -->
    <select-color v-if="this.$route.meta.bottom" />
  </v-app>
</template>

<script>
import Authentication from "@/components/Authentication.vue";
import SelectColor from "@/components/selectColor.vue";
import firebase from "firebase";
import { mapActions } from "vuex";

export default {
  name: "App",

  components: {
    Authentication,
    SelectColor
  },
  created() {
    // 認証状態の判別
    firebase.auth().onAuthStateChanged(user => {
      this.setCurrentUser(user);
    });
  },
  methods: {
    // スプレット構文 or 分割代入 :挙動をあまり詳しく把握できていない(現状は一つなので、展開する必要もない・・)
    ...mapActions(["setCurrentUser"])
  }
};
</script>

<style scoped>
.linkFont {
  color: white;
}
</style>
