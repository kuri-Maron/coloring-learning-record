<template>
  <div>
    <h1 class="my-8">タスク編集</h1>

    <h2 class="mt-4">カラー割当中のタスク</h2>
    <p v-if="disabledSwapTask" class="blue--text text--lighten-4">
      ※メイン画面に記録中のカラーブロックがない場合のみ、他タスクを割当てることができます。
    </p>
    <v-list>
      <v-list-item
        v-for="(selectingTask, selectingTaskIndex) in selectingTasks"
        :key="selectingTask.taskId"
      >
        <v-list-item-icon>
          <v-icon :color="selectingTask.colorCode">
            mdi-pencil
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            v-text="selectingTask.taskText"
          ></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-dialog
            v-model="swapTaskDialog"
            scrollable
            max-width="300px"
            persistent
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="disabledSwapTask"
                text
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="setSwapCurrentTask(selectingTask, selectingTaskIndex)"
              >
                変更
              </v-btn>
            </template>
            <v-card>
              <v-card-title>新しく割当てるタスク</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-radio-group v-model="replaceTaskIndex" column>
                  <v-radio
                    v-for="(notSelectingTask, index) in notSelectingTasks"
                    :key="notSelectingTask.taskId"
                    :label="notSelectingTask.taskText"
                    :value="index"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="primary" text @click="swapTaskDialog = false">
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="
                    swapTaskMethod();
                    swapTaskDialog = false;
                  "
                >
                  決定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <h2 class="mt-4">新規タスクの追加</h2>
    <v-form v-model="isValidNewTask" ref="formRegisterTask" @submit.prevent>
      <v-row align="center" class="my-3">
        <v-text-field
          label="新規タスク名"
          v-model="newTaskTextInput"
          :rules="[rules.required, rules.counter]"
          counter="15"
          class="ml-3"
          @blur="resetNewTaskTextInput"
        ></v-text-field>
        <v-btn
          :disabled="!isValidNewTask"
          color="primary"
          outlined
          small
          @click="registerTask()"
          >タスク登録</v-btn
        >
      </v-row>
    </v-form>
    <h2 class="mt-4">他タスクの一覧</h2>
    <v-list>
      <v-list-item
        v-for="(notSelectingTask, notSelectingTaskIndex) in notSelectingTasks"
        :key="notSelectingTask.taskId"
      >
        <v-list-item-content>
          <v-list-item-title
            v-text="notSelectingTask.taskText"
          ></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <div>
            <v-dialog
              v-model="renameDialog"
              max-width="300px"
              persistent
              :retain-focus="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="
                    setRenameTask(notSelectingTask, notSelectingTaskIndex)
                  "
                >
                  名前変更
                </v-btn>
              </template>
              <v-card>
                <v-form
                  v-model="isValidRenameTask"
                  ref="formRenameTask"
                  @submit.prevent
                >
                  <v-card-title>タスクの新しい名前</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-text-field
                      label="タスク名"
                      v-model="renameTaskTextInput"
                      :rules="[rules.required, rules.counter]"
                      counter="15"
                    ></v-text-field>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      text
                      @click="
                        cancelRename();
                        renameDialog = false;
                      "
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      :disabled="!isValidRenameTask"
                      color="primary"
                      text
                      @click="
                        renameTextMethod();
                        renameDialog = false;
                      "
                    >
                      決定
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <v-btn
              text
              color="primary"
              @click="deleteTaskMethod(notSelectingTask, notSelectingTaskIndex)"
            >
              削除
            </v-btn>
          </div>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      newTaskTextInput: "", //新規タスク用の入力ボックス
      renameTaskTextInput: "", //名前変更用の入力ボックス
      isValidNewTask: false, //新規タスクのバリデーションフラグ
      isValidRenameTask: false, //名前変更のバリデーションフラグ
      rules: {
        required: (value) => !!value || "必須入力です。",
        counter: (value) =>
          (value && value.length <= 15) || "15文字以内で入力してください。",
      }, //入力ボックスのバリデーション
      replaceTaskIndex: null, //対象カラーに新しく割当てるタスクのインデックス
      swapCurrentTask: {}, //対象カラーに現在割当中のタスク
      renameTask: {}, //名前変更をするタスク
      swapTaskDialog: false,
      renameDialog: false,
    };
  },
  computed: {
    selectingTasks() {
      return this.$store.state.selecitngTasks;
    },
    notSelectingTasks() {
      return this.$store.state.notSelectingTasks;
    },
    disabledSwapTask() {
      return this.$store.state.cellList.filter((cell) => "taskId" in cell)
        .length >= 1
        ? true
        : false;
    },
  },
  methods: {
    ...mapActions([
      "registerTaskToStore",
      "swapTask",
      "renameText",
      "deleteTask",
    ]),
    // 新規タスクの登録
    async registerTask() {
      if (this.isValidNewTask) {
        await this.registerTaskToStore({
          newTaskTextInput: this.newTaskTextInput,
          formRegisterTask: this.$refs.formRegisterTask,
        });
      }
    },
    // TODO: 下記、ロジック改善ができるとよい
    //カラー割当中タスクを選択した他タスクに変更する
    async swapTaskMethod() {
      await this.swapTask({
        replaceTaskIndex: this.replaceTaskIndex,
        swapCurrentTask: this.swapCurrentTask,
      });
      // 入替え対象のタスクをクリア
      this.replaceTaskIndex = null;
      this.swapCurrentTask = {};
    },
    // 割当タスク変更ボタン押下時に選択したタスクをstateにセット
    setSwapCurrentTask(task, index) {
      this.swapCurrentTask = { ...task, index };
      console.log(this.swapCurrentTask);
    },
    // 名前変更ボタン押下時に選択したタスクをstateにセット
    setRenameTask(task, index) {
      this.renameTask = { ...task, index };
    },
    // 名前変更するダイアログで決定ボタン押下に、入力した名前で更新
    async renameTextMethod() {
      if (this.isValidRenameTask) {
        await this.renameText({
          renameTaskTextInput: this.renameTaskTextInput,
          renameTask: this.renameTask,
          formRenameTask: this.$refs["formRenameTask"][
            this.$refs["formRenameTask"].length - 1
          ],
        });
      }
    },
    // タスクの削除
    async deleteTaskMethod(task, index) {
      await this.deleteTask({ task, index });
    },
    // 名前変更のダイアログでキャンセル押下時に、フォームをリセット
    cancelRename() {
      this.$refs["formRenameTask"][
        this.$refs["formRenameTask"].length - 1
      ].reset();
    },
    resetNewTaskTextInput() {
      this.$refs.formRegisterTask.reset();
    },
  },
};
</script>
