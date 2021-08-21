import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
Vue.use(Vuex);

// TODO: modules化するべき？
export default new Vuex.Store({
  state: {
    user: null,
    checkedAuthState: false,
    activeColor: {},
    mappingTaskAndColor: {},
    selecitngTasks: [],
    notSelectingTasks: [],
    cellList: Array(32).fill({}),
  },
  getters: {
    // user: (state) => state.user,
    uid: (state) => (state.user ? state.user.uid : null),
  },
  mutations,
  actions,
  // 規模が大きくなったときの利用するのか？
  // modules: {},
});
