<template>
  <div class="d-flex align-center">
    <div class="d-flex align-center" v-if="user" key="logout">
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
      <span v-if="!$vuetify.breakpoint.mobile" class="d-inline-block ma-3">{{
        user.displayName
      }}</span>
      <v-btn class="pa-2" light @click="logout()" style="text-transform: none">
        <v-icon light left>
          mdi-logout
        </v-icon>
        Sign out</v-btn
      >
    </div>

    <div v-show="!user" key="login">
      <!-- <div id="firebaseui-auth-container"></div> -->
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
// import * as firebaseui from "firebaseui";
// import "firebaseui/dist/firebaseui.css";

export default {
  name: "Authentication",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  // mounted() {
  //   // googoleサインインボタンの生成
  //   let ui = new firebaseui.auth.AuthUI(firebase.auth());
  //   let uiConfig = {
  //     signInFlow: "popup",
  //     signInSuccessUrl: "/",
  //     signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  //   };
  //   ui.start("#firebaseui-auth-container", uiConfig);
  // },
  methods: {
    // login() {
    //   const provider = new firebase.auth.GoogleAuthProvider();
    //   firebase.auth().signInWithRedirect(provider);
    // },
    logout() {
      firebase.auth().signOut();
      this.$route.path !== "/about" && this.$router.push({ name: "About" });
    },
    // 認証状況判断のリスナーは、ルートコンポーネントで実装する
    // ...mapActions(["setCurrentUser"])
  },
};
</script>
