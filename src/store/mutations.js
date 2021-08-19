import Vue from "vue";
import MUTATION_TYPES from "./mutation-types";
// import getColorCode from "@/common/get-color-code";

const mutations = {
  [MUTATION_TYPES.SET_CURRENT_USER](state, user) {
    state.user = user;
  },
  [MUTATION_TYPES.SET_ACTIVE_COLOR](state, color) {
    state.activeColor = color;
  },
  [MUTATION_TYPES.SET_MAPPING_TASK_AND_COLOR](state, mappingValue) {
    state.mappingTaskAndColor = mappingValue;
  },
  [MUTATION_TYPES.SET_SELECTING_TASKS](state, tasks) {
    state.selecitngTasks.push(...tasks);
  },
  [MUTATION_TYPES.SET_NOT_SELECTING_TASKS](state, tasks) {
    state.notSelectingTasks.push(...tasks);
  },
  [MUTATION_TYPES.SET_CELL_LIST](state, cellList) {
    cellList.forEach((cell, index) => {
      Vue.set(state.cellList, index, cell);
    });
  },
  [MUTATION_TYPES.DELETE_CELL](state, index) {
    state.cellList.splice(index, 1);
    state.cellList.push({});
  },
  [MUTATION_TYPES.ADD_CELL](state, { doc, index }) {
    Vue.set(state.cellList, index, {
      taskId: state.activeColor.taskId,
      colorCode: state.activeColor.colorCode,
      id: doc.id,
    });
  },
  [MUTATION_TYPES.SUM_TASK_COUNT](state, taskCount) {
    for (const taskId in taskCount) {
      const sumCountTaskIndex = state.selecitngTasks.findIndex(
        (task) => task.taskId === taskId
      );
      state.selecitngTasks[sumCountTaskIndex].count += taskCount[taskId];
    }
  },
  [MUTATION_TYPES.RESET_CELL_LIST](state) {
    state.cellList.splice(0, state.cellList.length, ...Array(32).fill({}));
  },
  // タスクの入れ替え
  [MUTATION_TYPES.SWAP_TASK](
    state,
    { replaceTaskIndex, replaceTask, swapCurrentTask }
  ) {
    state.selecitngTasks.splice(swapCurrentTask.index, 1, {
      ...replaceTask,
      selecting: true,
      color: swapCurrentTask.color,
      colorCode: swapCurrentTask.colorCode,
    });

    //   置換済みのタスクを削除し、入れ替え元のタスクをセット
    delete swapCurrentTask.index;
    delete swapCurrentTask.colorCode;
    state.notSelectingTasks.splice(replaceTaskIndex, 1, {
      ...swapCurrentTask,
      selecting: false,
      color: "",
    });
  },
  [MUTATION_TYPES.RENAME_TEXT](state, { renameTaskTextInput, renameTask }) {
    Vue.set(
      state.notSelectingTasks[renameTask.index],
      "taskText",
      renameTaskTextInput
    );
  },
  [MUTATION_TYPES.DELETE_TASK](state, index) {
    state.notSelectingTasks.splice(index, 1);
  },
};

export default mutations;
