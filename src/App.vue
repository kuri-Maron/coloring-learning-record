<template>
  <v-app>
    <v-app-bar app color="green darken-3">
      <div class="d-flex align-center">
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />-->
        <router-link class="linkFont" to="/">Home</router-link>|
        <router-link class="linkFont" to="/about">About</router-link>
      </div>

      <v-spacer></v-spacer>

      <!-- 認証機能配置 -->
      <Authentication />
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Authentication from "@/components/Authentication.vue";
import firebase from "firebase";
import { mapActions } from "vuex";

export default {
  name: "App",

  components: {
    Authentication
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.setCurrentUser(user);
    });
  },
  methods: {
    ...mapActions(["setCurrentUser"])
  }
};
</script>

<style scoped>
.linkFont {
  color: white;
}
</style>