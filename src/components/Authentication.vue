<template>
  <div class="authentication">
    <!-- ログイン時のレイアウト -->
    <div v-if="user !== null" key="login">
      <p>{{user.displayName}}</p>
      <v-btn type="button" @click="logout()">Sign out</v-btn>
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
    created(){
        // ログイン状態の取得（TODO: App.vueに写して試す。マウントの関係で正常に実行できない）
        // firebase.auth().onAuthStateChanged(user => {
        //     this.setCurrentUser(user);
        // });
    },
    computed: {
        user() {return this.$store.state.user}
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
}
</script>