<template>
  <div>
    <v-bottom-navigation
      app
      mandatory
      grow
      background-color="#121212"
      v-model="activeColorText"
    >
      <v-btn
        v-ripple
        text
        :class="{ 'text-caption': $vuetify.breakpoint.xs }"
        v-for="colorObj in colorList"
        :color="colorObj.colorCode"
        :key="colorObj.taskText"
        :value="colorObj"
      >
        <span :style="{ color: colorObj.colorCode }" class="button_text">{{
          colorObj.taskText
        }}</span>
        <v-icon
          dense
          :color="
            activeColorText.colorCode == colorObj.colorCode
              ? colorObj.colorCode
              : '#121212'
          "
          >mdi-pencil</v-icon
        >
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
// colorList: [
//   // {
//   //   colorText: "green",
//   //   colorCode: "#4CAF50",
//   //   description: "タスク1",
//   // },
//   // { colorText: "blue", colorCode: "#3F51B5", description: "タスク2" },
//   // { colorText: "yellow", colorCode: "#FFAB00", description: "タスク3" },
//   // { colorText: "red", colorCode: "#FF5252", description: "タスク4" },
// ],

import firebase from "firebase/app";
import "firebase/firestore";
import getColorCode from "@/common/get-color-code";
export default {
  data() {
    return {
      colorList: [],
    };
  },
  // async mounted() {
  async created() {
    await this.fetchTaskButtons();
    this.setMappingTaskAndColor();
  },
  computed: {
    // vuexのstateに現在アクティブなカラーオブジェクト情報を設定している
    activeColorText: {
      get() {
        return this.$store.state.activeColor;
      },
      set(value) {
        this.$store.commit("setColor", value);
      },
    },
  },
  methods: {
    async fetchTaskButtons() {
      if (this.$store.state.user) {
        await firebase
          .firestore()
          .collection(`users/${this.$store.getters.uid}/taskList`)
          .where("selecting", "==", true)
          .orderBy("color")
          .get()
          .then(async (snapshot) => {
            if (snapshot.size === 0) {
              // コレクション内にドキュメントが存在しない場合
              // 新規で仮タスクを登録する
              await this.setInitialTask();
            } else {
              // コレクション内にドキュメントが存在する場合
              snapshot.docs.forEach((doc) => {
                this.colorList.push({
                  taskId: doc.id,
                  taskText: doc.get("taskText"),
                  color: doc.get("color"),
                  colorCode: getColorCode(doc.get("color")),
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    async setInitialTask() {
      const colorArray = ["blue", "green", "red", "yellow"];
      for (let i = 0; i < 4; i++) {
        // DBとフロントの両方で保持するデータ
        const baseObj = {
          color: colorArray[i],
          taskText: `task${i + 1}`,
        };
        await firebase
          .firestore()
          .collection(`users/${this.$store.getters.uid}/taskList`)
          .add({
            ...baseObj,
            selecting: true,
            count: 0,
          })
          .then((doc) => {
            console.log("Document written with ID: ", doc.id);
            this.colorList.push({
              ...baseObj,
              colorCode: getColorCode(baseObj.color),
              taskId: doc.id,
            });
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    },

    setMappingTaskAndColor() {
      const mappingTaskandColor = this.colorList.reduce(
        (obj, data) => ({
          ...obj,
          [data.taskId]: data.colorCode,
        }),
        {}
      );
      this.$store.commit("setMappingTaskAndColor", mappingTaskandColor);
    },
  },
};
</script>

<style scoped>
.button_text {
  width: 168px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
