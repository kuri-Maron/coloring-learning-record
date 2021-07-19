<template>
  <div>
    <h1 class="my-8">タスク編集</h1>

    <h2 class="mt-4">割当済のタスク</h2>
    <v-list>
      <v-list-item
        v-for="selectingTask in selectingTasks"
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
          <!-- <v-btn text>
            変更
          </v-btn> -->
          <v-dialog
            v-model="dialog"
            scrollable
            max-width="300px"
            persistent
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                変更
              </v-btn>
            </template>
            <v-card>
              <v-card-title>新しく割り当てるタスク</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-radio-group v-model="replaceTask" column>
                  <v-radio
                    v-for="notSelectingTask in notSelectingTasks"
                    :key="selectingTask.taskId + notSelectingTask.taskId"
                    :label="notSelectingTask.taskText"
                    :value="notSelectingTask"
                  ></v-radio>
                  <!-- <v-radio label="Bahamas, The" value="bahamas"></v-radio> -->
                </v-radio-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    swapTasks(selectingTask);
                    dialog = false;
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <h2 class="mt-4">新規タスクの追加</h2>
    <v-row>
      <v-text-field
        class="ml-3"
        label="新規タスク"
        v-model="newTask"
      ></v-text-field>
      <v-btn color="primary" @click="registerTask()">タスク登録</v-btn>
    </v-row>
    <p>{{ newTask }}</p>
    <h2 class="mt-4">他タスクの一覧</h2>
    <v-list>
      <v-list-item
        v-for="notSelectingTask in notSelectingTasks"
        :key="notSelectingTask.taskId"
      >
        <v-list-item-content>
          <v-list-item-title
            v-text="notSelectingTask.taskText"
          ></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <div>
            <v-btn text>
              名前変更
            </v-btn>
            <v-btn text>
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
      //   items: ["hoge", "fuga", "foo", "bar"],
      selectingTasks: [],
      notSelectingTasks: [],
      newTask: "",
      replaceTask: "",
      dialog: false,
      db: null,
    };
  },
  async created() {
    this.db = firebase.firestore();
    await this.fetchSelectingTasks();
    await this.fetchNotSelectingTasks();
  },
  methods: {
    async fetchSelectingTasks() {
      if (this.$store.state.user) {
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
      }
    },
    async fetchNotSelectingTasks() {
      if (this.$store.state.user) {
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
            console.log("エラーだと");
            console.log(err);
          });
      }
    },
    async registerTask() {
      if (this.$store.state.user) {
        await this.db
          .collection(`users/${this.$store.getters.uid}/taskList`)
          .add({
            taskText: this.newTask,
            count: 0,
            selecting: false,
          })
          .then((doc) => {
            console.log(doc);
            this.notSelectingTasks.push({
              taskId: doc.id,
              taskText: this.newTask,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    swapTasks(currentTask) {
      console.log(currentTask, this.replaceTask);
    },
  },
};
</script>
