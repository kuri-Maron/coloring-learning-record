import MUTATION_TYPES from "./mutation-types";

const mutations = {
  [MUTATION_TYPES.SET_CURRENT_USER](state, user) {
    state.user = user;
  },
  [MUTATION_TYPES.SET_ACTIVE_COLOR](state, color) {
    state.activeColor = color;
  },
  [MUTATION_TYPES.SET_MAPPING_TASK_AND_COLOR](state, mappingValue) {
    state.mappingValue = mappingValue;
  },
};

export default mutations;
