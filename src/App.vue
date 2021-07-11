<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>学習記録</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <!-- 認証機能コンポーネント -->
      <Authentication />
    </v-app-bar>

    <!-- サイドナビバー TODO: 単一コンポーネント化@drawer扱い-->
    <v-navigation-drawer v-model="drawer" absolute  temporary>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!-- コンテナーを横に広げる -->
      <v-container fluid>
        <router-view v-if="$store.state.user"/>
      </v-container>
    </v-main>
    <!-- metaにbottomが設定されているviewだけボトムバーを表示 -->
    <select-color v-if="this.$route.meta.bottom" />
  </v-app>
</template>

<script>
import Authentication from "@/components/Authentication.vue";
import SelectColor from "@/components/selectColor.vue";
import firebase from "firebase/app";
import "firebase/auth";
import { mapActions } from "vuex";

export default {
  name: "App",

  components: {
    Authentication,
    SelectColor
  },
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", icon: "mdi-home", link: { name: "Home" } },
        { title: "About", icon: "mdi-information", link: { name: "About" } },
        { title: "Analysis", icon: "mdi-google-analytics", link: {name: "Analysis"} }
      ]
    };
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
