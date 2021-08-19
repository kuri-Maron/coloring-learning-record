<template>
  <v-app class="app">
    <!-- サイドナビバー TODO: 単一コンポーネント化@drawer扱い-->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list nav>
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

    <v-app-bar app>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>学習記録</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <!-- 認証機能コンポーネント -->
      <Authentication />
    </v-app-bar>

    <v-main>
      <!-- コンテナーを横に広げる -->
      <!-- <v-container fluid> -->
      <v-container>
        <router-view v-if="$store.state.user" />
      </v-container>
    </v-main>
    <!-- metaにbottomが設定されているviewだけボトムバーを表示 -->
    <select-color v-if="this.$route.meta.bottom && $store.state.user" />
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
    SelectColor,
  },
  data() {
    return {
      drawer: false,
      items: [
        // ルート要素のみ、nameプロパティでバインドするとバグるので、pathプロパティを使用
        // { title: "Home", icon: "mdi-home", link: { name: "Home" } },
        // { title: "Home", icon: "mdi-home", link: "/" },
        { title: "Home", icon: "mdi-home", link: { path: "/" } },
        { title: "タスクの編集", icon: "mdi-pencil", link: { name: "Task" } },
        {
          title: "これまでの記録",
          icon: "mdi-google-analytics",
          link: { name: "Analysis" },
        },
        { title: "About", icon: "mdi-information", link: { name: "About" } },
      ],
    };
  },
  created() {
    // 認証状態の判別
    firebase.auth().onAuthStateChanged(async (user) => {
      console.log("user: ", user);
      this.setCurrentUser(user);
      // ログインした場合、ＤＢからメインデータ取得
      if (user) {
        await this.fetchTasks();
        await this.fetchCellList();
      }
    });
  },
  methods: {
    ...mapActions(["setCurrentUser", "fetchTasks", "fetchCellList"]),
  },
};
</script>

<style scoped>
.app {
  min-width: 300px;
}
/* .linkFont {
  color: white;
} */
</style>
