import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
// import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    activeColor: {},
    mappingTaskandColor: {},
  },
  getters: {
    user: (state) => state.user,
    uid: (state) => (state.user ? state.user.uid : null),
  },
  mutations,
  actions,
  // mutations: {
  //   setCurrentUser(state, user) {
  //     state.user = user;
  //   },
  //   setColor(state, color) {
  //     state.activeColor = color;
  //   },
  //   setMappingTaskAndColor(state, mappingValue) {
  //     state.mappingTaskandColor = mappingValue;
  //   },
  // },

  // actionsの利用価値がピンとこない(ミューテーション呼ぶ前の事前処理にためか？)
  // actions: {
  //   setCurrentUser({ commit }, user) {
  //     commit("setCurrentUser", user);
  //   },
  // },

  // 規模が大きくなったときの利用するのか？
  // modules: {},
});
