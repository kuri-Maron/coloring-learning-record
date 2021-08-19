import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "@/firebase";
import MUTATION_TYPES from "./mutation-types";
import getColorCode from "@/common/get-color-code";

export default {
  setCurrentUser({ commit }, user) {
    commit(MUTATION_TYPES.SET_CURRENT_USER, user);
  },
  async fetchTasks({ commit, state, getters }) {
    if (state.user) {
      await db
        .collection(`users/${getters.uid}/taskList`)
        .orderBy("color")
        .get()
        .then(async (snapshot) => {
          let selecitngTasks = [];
          let notSelectingTasks = [];
          snapshot.docs.forEach((doc) => {
            // selectingプロパティが存在するか確認
            if ("selecting" in doc.data()) {
              // selectingプロパティの値によって処理分岐
              if (doc.get("selecting")) {
                selecitngTasks.push({
                  ...doc.data(),
                  taskId: doc.id,
                  colorCode: getColorCode(doc.get("color")),
                });
              } else {
                notSelectingTasks.push({
                  ...doc.data(),
                  taskId: doc.id,
                });
              }
            }
          });
          // TODO: この判定ロジックは使わず、userドキュメントのプロパティで初回ログインユーザが判断のほうがよい気がする
          if (selecitngTasks.length === 0) {
            await setInitialTask(commit, getters);
          } else {
            commit(MUTATION_TYPES.SET_SELECTING_TASKS, selecitngTasks);
            notSelectingTasks.length > 0 &&
              commit(MUTATION_TYPES.SET_NOT_SELECTING_TASKS, notSelectingTasks);
          }

          // タスクとカラーの紐付け
          const mappingTaskAndColor = state.selecitngTasks.reduce(
            (obj, data) => ({
              ...obj,
              [data.taskId]: data.colorCode,
            }),
            {}
          );
          commit(
            MUTATION_TYPES.SET_MAPPING_TASK_AND_COLOR,
            mappingTaskAndColor
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  async fetchCellList({ commit, state, getters }) {
    if (state.user) {
      await db
        .collection(`users/${getters.uid}/cells`)
        .orderBy("timeStamp")
        .get()
        .then((snapshot) => {
          const cellList = snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              colorCode: state.mappingTaskAndColor[doc.get("taskId")],
              id: doc.id,
            };
          });
          commit(MUTATION_TYPES.SET_CELL_LIST, cellList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  async deleteCell({ commit, state, getters }, index) {
    if (state.user) {
      await db
        .collection(`users/${getters.uid}/cells`)
        .doc(state.cellList[index].id)
        .delete()
        .then(() => {
          commit(MUTATION_TYPES.DELETE_CELL, index);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  async addCell({ commit, state, getters }, index) {
    if (state.user) {
      await db
        .collection(`users/${getters.uid}/cells`)
        .add({
          taskId: state.activeColor.taskId,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          commit(MUTATION_TYPES.ADD_CELL, { doc, index });
        });
    }
  },
  mergeCellList({ commit, state, getters }) {
    // key:taskId, value:countのオブジェクト
    let taskCount = {};
    let batch = db.batch();
    state.cellList.forEach((cell) => {
      if ("id" in cell) {
        let cellDocRef = db
          .collection(`users/${getters.uid}/cells`)
          .doc(cell.id);
        batch.delete(cellDocRef);

        let taskDocRef = db
          .collection(`users/${getters.uid}/taskList`)
          .doc(cell.taskId);
        batch.update(taskDocRef, {
          count: firebase.firestore.FieldValue.increment(1),
        });
        taskCount[cell.taskId] || (taskCount[cell.taskId] = 0);
        ++taskCount[cell.taskId];
      }
    });
    batch
      .commit()
      .then(() => {
        commit(MUTATION_TYPES.SUM_TASK_COUNT, taskCount);
        commit(MUTATION_TYPES.RESET_CELL_LIST);
      })
      .catch((err) => console.log(err));
  },
  async registerTaskToStore(
    { commit, state, getters },
    { newTaskTextInput, formRegisterTask }
  ) {
    if (state.user) {
      await db
        .collection(`users/${getters.uid}/taskList`)
        .add({
          taskText: newTaskTextInput,
          count: 0,
          selecting: false,
          color: "",
        })
        .then((doc) => {
          commit(MUTATION_TYPES.SET_NOT_SELECTING_TASKS, [
            {
              taskId: doc.id,
              taskText: newTaskTextInput,
              count: 0,
              selecting: false,
              color: "",
            },
          ]);
          formRegisterTask.reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  async swapTask(
    { commit, state, getters },
    { replaceTaskIndex, swapCurrentTask }
  ) {
    const replaceTask = state.notSelectingTasks[replaceTaskIndex];
    // firebaseの更新
    let batch = db.batch();
    // 選択中タスクの解除
    let swapCurrentTaskDocRef = db
      .collection(`users/${getters.uid}/taskList`)
      .doc(swapCurrentTask.taskId);
    batch.update(swapCurrentTaskDocRef, {
      selecting: false,
      color: "",
    });
    // 置換タスクのセット
    let replaceTaskDocRef = db
      .collection(`users/${getters.uid}/taskList`)
      .doc(replaceTask.taskId);
    batch.update(replaceTaskDocRef, {
      selecting: true,
      color: swapCurrentTask.color,
    });

    await batch
      .commit()
      .then(() => {
        commit(MUTATION_TYPES.SWAP_TASK, {
          replaceTaskIndex,
          replaceTask,
          swapCurrentTask,
        });
      })
      .catch((err) => console.log(err));
  },
  async renameText(
    { commit, getters },
    { renameTaskTextInput, renameTask, formRenameTask }
  ) {
    await db
      .collection(`users/${getters.uid}/taskList`)
      .doc(renameTask.taskId)
      .update({
        taskText: renameTaskTextInput,
      })
      .then(() => {
        commit(MUTATION_TYPES.RENAME_TEXT, { renameTaskTextInput, renameTask });
        formRenameTask.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  async deleteTask({ commit, getters }, { task, index }) {
    await db
      .collection(`users/${getters.uid}/taskList`)
      .doc(task.taskId)
      .delete()
      .then(() => {
        commit(MUTATION_TYPES.DELETE_TASK, index);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

const setInitialTask = async (commit, getters) => {
  const tasks = [];
  const colorArray = ["blue", "green", "red", "yellow"];
  for (let i = 0; i < 4; i++) {
    // DBとフロントの両方で保持するデータ
    const initTask = {
      color: colorArray[i],
      taskText: `タスク${i + 1}`,
      selecting: true,
      count: 0,
    };
    await db
      .collection(`users/${getters.uid}/taskList`)
      .add(initTask)
      .then((doc) => {
        tasks.push({
          ...initTask,
          taskId: doc.id,
          colorCode: getColorCode(initTask.color),
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  commit(MUTATION_TYPES.SET_SELECTING_TASKS, tasks);
};
