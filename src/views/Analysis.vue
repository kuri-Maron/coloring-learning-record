<template>
  <div style="height: 100%;">
    <v-sheet color="grey darken-2" min-height="600px" height="85vh">
      <v-container style="min-height: inherit; height: 100%;">
        <v-row justify="center">
          <h1>これまでの記録</h1>
        </v-row>
        <v-row
          align="center"
          align-content="center"
          justify="space-around"
          style="height: 90%;"
        >
          <v-col
            cols="10"
            md="5"
            class="my-sm-5"
            :style="`height: ${viewportHeight};`"
          >
            <v-card class="card d-flex align-center justify-center pb-5">
              <div class="d-flex flex-column justify-center">
                <v-window v-model="onboarding">
                  <v-window-item
                    v-for="value in countCellDatas"
                    :key="value.id"
                  >
                    <!-- TODO: 新しいvuetifyのサンプルコードを参考にリファクタリングする -->
                    <v-row align="center" justify="center" tag="v-card-text">
                      <v-card-text class="text-center text-h6">
                        {{ value.taskText }}
                      </v-card-text>
                    </v-row>
                    <!-- tag="v-card-text" これ何？ -->
                    <v-row align="center" justify="center" tag="v-card-text">
                      <v-card-text class="text-center white--text text-h4">{{
                        value.count | timeNotation
                      }}</v-card-text>
                    </v-row>
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
                      v-for="(value, index) in countCellDatas"
                      :key="`btn-${index}`"
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
              </div>
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
              <graph-view :countCellDatas="propsCountCellDatas" />
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
import firebase from "firebase/app";
import "firebase/firestore";
import GraphView from "@/components/GraphView.vue";
import getColorCode from "@/common/get-color-code";

export default {
  components: {
    GraphView,
  },
  data() {
    return {
      onboarding: 0,
      countCellDatas: [
        {
          id: "sumHour",
          count: 0,
          taskText: "総合計時間",
        },
      ],
    };
  },
  async created() {
    if (this.$store.state.user) {
      // TODO: firestoreをDBとして定義する
      const querySnapshot = await firebase
        .firestore()
        .collection(`users/${this.$store.getters.uid}/taskList`)
        .where("selecting", "==", true)
        .orderBy("count", "desc")
        .get();
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        this.countCellDatas.push({
          id: doc.id,
          taskText: docData.taskText,
          count: docData.count,
          colorCode: getColorCode(docData.color),
        });
        this.countCellDatas[0].count += docData.count;
      });
    }
  },
  computed: {
    propsCountCellDatas() {
      return this.countCellDatas.map((countCellData) => countCellData).slice(1);
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
        this.onboarding + 1 === this.countCellDatas.length
          ? 0
          : this.onboarding + 1;
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 < 0
          ? this.countCellDatas.length - 1
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
