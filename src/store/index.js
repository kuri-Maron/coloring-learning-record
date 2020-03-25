import Vue from "vue";
import Vuex from "vuex";
// import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    seleectColor: {}
  },
  getters: {
    user: state => state.user,
    uid: state => state.user ? state.user.uid : null
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
