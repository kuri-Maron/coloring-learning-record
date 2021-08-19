<template>
  <div style="height: 100%;">
    <v-sheet color="grey darken-2" min-height="600px" height="85vh">
      <v-container style="min-height: inherit; height: 100%;">
        <v-row justify="center">
          <h1>これまでの記録</h1>
        </v-row>
        <v-row align="center" justify="space-around" style="height: 90%;">
          <v-col
            cols="10"
            md="5"
            class="my-sm-5"
            :style="`height: ${viewportHeight};`"
          >
            <v-card class="card d-flex flex-column align-center justify-center">
              <v-window v-model="onboarding">
                <v-window-item
                  v-for="countTaskData in countTaskListData"
                  :key="countTaskData.taskId"
                >
                  <v-card-text class="text-center text-h6">
                    {{ countTaskData.taskText }}
                  </v-card-text>
                  <v-card-text class="text-center text-h4">{{
                    countTaskData.count | timeNotation
                  }}</v-card-text>
                </v-window-item>
              </v-window>

              <v-card-actions class="justify-space-between">
                <v-btn text @click="prev">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-item-group
                  v-model="onboarding"
                  class="text-center"
                  mandatory
                >
                  <v-item
                    v-for="countTaskData in countTaskListData"
                    :key="`btn-${countTaskData.taskId}`"
                    v-slot:default="{ active, toggle }"
                  >
                    <v-btn :input-value="active" icon @click="toggle">
                      <v-icon>mdi-record</v-icon>
                    </v-btn>
                  </v-item>
                </v-item-group>
                <v-btn text @click="next">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- 円グラフ表示部 -->
          <v-col
            cols="10"
            md="5"
            class="my-sm-5"
            :style="`height: ${viewportHeight};`"
          >
            <v-card class="card pa-2">
              <graph-view
                v-if="countTaskListData[0].count !== 0"
                :countTaskListData="countTaskListData.slice(1)"
              />
              <v-card-text>
                <p v-if="countTaskListData[0].count === 0">
                  選択中のタスクはまだ記録されたデータが存在しないので、円グラフは表示されません。
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style scoped>
.card {
  height: 100%;
  /* min-height: 350px; */
}
</style>

<script>
import "firebase/firestore";
import GraphView from "@/components/GraphView.vue";

export default {
  components: {
    GraphView,
  },
  data() {
    return {
      onboarding: 0,
      db: null,
    };
  },
  computed: {
    countTaskListData() {
      let taskList = this.$store.state.selecitngTasks.map((task) => task);
      taskList.sort((a, b) => b.count - a.count);
      const samCount = taskList.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count,
        0
      );
      return [
        {
          id: "sumHour",
          count: samCount,
          taskText: "総合計時間",
        },
        ...taskList,
      ];
    },
    viewportHeight() {
      let height;
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          height = "45%";
          break;
        case "sm":
          height = "45%";
          break;
        default:
          height = "80%";
      }
      return height;
    },
  },
  methods: {
    next() {
      this.onboarding =
        this.onboarding + 1 === this.countTaskListData.length
          ? 0
          : this.onboarding + 1;
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 < 0
          ? this.countTaskListData.length - 1
          : this.onboarding - 1;
    },
  },
  filters: {
    timeNotation(val) {
      let totalMinutes = val * 15;
      let hour = ("0" + Math.floor(totalMinutes / 60)).slice(-2);
      let minutes = ("0" + (totalMinutes % 60)).slice(-2);

      return `${hour}:${minutes}`;
    },
  },
};
</script>
