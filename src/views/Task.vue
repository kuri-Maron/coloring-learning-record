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
                    swapTasks();
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
    <v-form v-model="isValidNewTask" ref="formRegisterTask">
      <v-row align="center" class="my-3">
        <v-text-field
          label="新規タスク名"
          v-model="newTaskTextInput"
          :rules="[rules.required, rules.counter]"
          counter="15"
          class="ml-3"
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
                <v-form v-model="isValidRenameTask" ref="formRenameTask">
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
                        renameText();
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
              @click="deleteTask(notSelectingTask, notSelectingTaskIndex)"
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
import firebase from "firebase/app";
import "firebase/firestore";
import getColorCode from "@/common/get-color-code";
export default {
  data() {
    return {
      selectingTasks: [], //カラー割当中のタスク一覧
      notSelectingTasks: [], //他タスクの一覧
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
      disabledSwapTask: false, //カラー割当タスクの変更ボタンの非活性制御
      db: null,
    };
  },
  async created() {
    this.db = firebase.firestore();
    await this.checkCellsCollectionSize();
    await this.fetchSelectingTasks();
    await this.fetchNotSelectingTasks();
  },
  // TODO: DBが関連するメソッドはすべて、ログイン有無の判断ロジックを挿入するべきか検討する
  methods: {
    // 記録中のタスクの有無をチェックし、カラータスクの変更ボタンの非活性を制御
    async checkCellsCollectionSize() {
      await this.db
        .collection(`users/${this.$store.getters.uid}/cells`)
        .get()
        .then((snapshot) => {
          if (snapshot.size >= 1) {
            this.disabledSwapTask = true;
          }
        });
    },
    // TODO: fetch処理は一回にまとめれる。もしくは、もっと上位の段階でまとめて取得し、vuex管理
    // カラー割当中タスクの一覧をDBから取得
    async fetchSelectingTasks() {
      await this.db
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .where("selecting", "==", true)
        .orderBy("color")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            this.selectingTasks.push({
              taskId: doc.id,
              taskText: doc.get("taskText"),
              color: doc.get("color"),
              colorCode: getColorCode(doc.get("color")),
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //他タスクの一覧をDBから取得
    async fetchNotSelectingTasks() {
      await this.db
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .where("selecting", "==", false)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());
            this.notSelectingTasks.push({
              taskId: doc.id,
              taskText: doc.get("taskText"),
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 新規タスクの登録
    async registerTask() {
      if (this.isValidNewTask) {
        await this.db
          .collection(`users/${this.$store.getters.uid}/taskList`)
          .add({
            taskText: this.newTaskTextInput,
            count: 0,
            selecting: false,
          })
          .then((doc) => {
            console.log(doc);
            this.notSelectingTasks.push({
              taskId: doc.id,
              taskText: this.newTaskTextInput,
            });
            this.$refs.formRegisterTask.reset();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // TODO: ロジックに改善の余地あり
    //カラー割当中タスクを選択した他タスクに変更する
    async swapTasks() {
      const replaceTask = this.notSelectingTasks[this.replaceTaskIndex];

      // firebaseの更新
      let batch = this.db.batch();
      // 選択中タスクの解除
      let swapCurrentTaskDocRef = this.db
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .doc(this.swapCurrentTask.taskId);
      batch.update(swapCurrentTaskDocRef, {
        selecting: false,
      });
      // 置換タスクのセット
      let replaceTaskDocRef = this.db
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .doc(replaceTask.taskId);
      batch.update(replaceTaskDocRef, {
        selecting: true,
        color: this.swapCurrentTask.color,
      });

      await batch
        .commit()
        .then(() => {
          // ローカルのstateの更新
          // 置換タスクをセット
          this.$set(this.selectingTasks, this.swapCurrentTask.index, {
            ...replaceTask,
            color: this.swapCurrentTask.color,
            colorCode: getColorCode(this.swapCurrentTask.color),
          });
          //   置換済みのタスクを削除
          this.notSelectingTasks.splice(this.replaceTaskIndex, 1);
          //   最初に選択されていたタスクを他タスクに追加
          this.notSelectingTasks.push({
            taskId: this.swapCurrentTask.taskId,
            taskText: this.swapCurrentTask.taskText,
          });
        })
        .catch((err) => console.log(err));

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
      console.log(this.renameTask);
    },
    // 名前変更するダイアログで決定ボタン押下に、入力した名前で更新
    async renameText() {
      console.log(this.$refs.formRenameTask);
      await this.db
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .doc(this.renameTask.taskId)
        .update({
          taskText: this.renameTaskTextInput,
        })
        .then(() => {
          this.$set(
            this.notSelectingTasks[this.renameTask.index],
            "taskText",
            this.renameTaskTextInput
          );
          // ロジックに改良の余地あり（v-slot,v-for,refあたりの関係を整理すること）
          this.$refs["formRenameTask"][
            this.$refs["formRenameTask"].length - 1
          ].reset();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // タスクの削除
    deleteTask(task, index) {
      this.db
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .doc(task.taskId)
        .delete()
        .then(() => {
          this.notSelectingTasks.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 名前変更のダイアログでキャンセル押下時に、フォームをリセット
    cancelRename() {
      this.$refs["formRenameTask"][
        this.$refs["formRenameTask"].length - 1
      ].reset();
    },
    // testMethod() {
    //   console.log(this.$refs);
    //   console.log(this.renameTask.index);
    //   this.$refs["formRenameTask"][
    //     this.$refs["formRenameTask"].length - 1
    //   ].reset();
    //   // this.$refs["formRenameTask" + this.renameTask.index][0].reset();
    // },
  },
};
</script>
