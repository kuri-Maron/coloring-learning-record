<template>
  <div class="d-flex align-center">
    <!-- ログイン時のレイアウト -->
    <div class="d-flex align-center" v-if="user !== null" key="login">
      <v-avatar max-height="100%">
        <v-img class="shrink mr-2" contain max-width="50px" width="5vw" :src="user.photoURL"></v-img>
      </v-avatar>
      <span class="d-inline-block ma-3">{{user.displayName}}</span>
      <v-btn class="ma-2" outlined type="button" @click="logout()">Sign out</v-btn>
      <!-- ログアウト時のレイアウト -->
    </div>
    <div v-else key="logout">
      <v-btn type="button" @click="login()">Sign in with Google</v-btn>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapActions } from "vuex";
export default {
  name: "Authentication",
  created() {
    // ログイン状態の取得（TODO: App.vueに写して試す。マウントの関係で正常に実行できない）
    // firebase.auth().onAuthStateChanged(user => {
    //     this.setCurrentUser(user);
    // });
  },
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
    ...mapActions(["setCurrentUser"])
  }
};
</script>