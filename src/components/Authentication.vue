<template>
  <div class="d-flex align-center">
    <!-- ログイン時のレイアウト -->
    <div class="d-flex align-center" v-if="user !== null" key="login">
      <!-- ログイン時のアイコン情報(このタグは、なくても表示はされる) -->
      <v-avatar max-height="100%">
        <!-- contain 属性は画像の切り取り不可 -->
        <v-img
          class="shrink mr-2"
          contain
          max-width="50px"
          width="5vw"
          :src="user.photoURL"
        ></v-img>
      </v-avatar>
      <!-- inline-block要素にする事で、margin設定している -->
      <span class="d-inline-block ma-3">{{ user.displayName }}</span>
      <v-btn class="pa-2" outlined type="button" @click="logout()"
        >Sign out</v-btn
      >
    </div>

    <!-- ログアウト時のレイアウト -->
    <div v-else key="logout">
      <v-btn type="button" @click="login()">Sign in with Google</v-btn>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// import { mapActions } from "vuex";

export default {
  name: "Authentication",
  // vuexのstateから直接参照していると、不具合が起きているので、一旦、ローカルでもつ。
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    logout() {
      firebase.auth().signOut();
    },
    // 認証状況判断のリスナーは、ルートコンポーネントで実装する
    // ...mapActions(["setCurrentUser"])
  }
};
</script>
