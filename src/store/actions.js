import MUTATION_TYPES from "./mutation-types";

export default {
  setCurrentUser({ commit }, user) {
    commit(MUTATION_TYPES.SET_CURRENT_USER, user);
  },
};
