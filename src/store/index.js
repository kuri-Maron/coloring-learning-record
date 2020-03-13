import Vue from "vue";
import Vuex from "vuex";
// import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setCurrentUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    setCurrentUser({ commit }, user) {
      commit("setCurrentUser", user);
    },
  },
  modules: {}
});
