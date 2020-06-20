<template>
  <v-sheet color="pink" max-height="90vh" height="89vh" min-height="600px">
    <!-- <v-sheet color="pink" max-height="90vh" height="89vh"> -->
    <v-card class="ma-auto text-center" max-width="50vmin">{{ imageHeight }}</v-card>

    <v-row align="center" justify="space-around" style="height: 95%;">
      <!-- <v-col cols="10" md="5" :style="`height: ${viewportHeight};`">
        <v-card class="card pa-2">
          <v-card-title>総合計時間</v-card-title>
          <div class="card-content d-flex align-center pb-10">
            <v-card-text class="card-main-text text-center"
              >HH : MM</v-card-text
            >
          </div>
        </v-card>
      </v-col>-->

      <v-col cols="10" md="5" :style="`height: ${viewportHeight};`">
        <!-- <v-card class="card pa-2"> -->
        <v-card class="card d-flex align-center justify-center pb-5">
          <!-- コピペwindow -->
          <div class="card-content d-flex flex-column justify-center">
            <v-window v-model="onboarding">
              <v-window-item v-for="(value, index) in countCellDatas" :key="`card-${index}`">
                <v-row align="center" justify="center" tag="v-card-text">
                  <v-card-text class="text-center">
                    {{
                    value.task
                    }}
                  </v-card-text>
                </v-row>
                <!-- tag="v-card-text" これ何？ -->
                <v-row align="center" justify="center" tag="v-card-text">
                  <v-card-text
                    style="font-size: 10vmin;"
                    class="text-center white--text"
                  >{{ value.count | timeNotation }}</v-card-text>
                </v-row>
              </v-window-item>
            </v-window>

            <v-card-actions class="justify-space-between">
              <v-btn text @click="prev">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-item-group v-model="onboarding" class="text-center" mandatory>
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
      <v-col cols="10" md="5" :style="`height: ${viewportHeight};`">
        <v-card class="card pa-2">
          <!-- <graph-view :countCellDatas="propsCountCellDatas" class="pie-chart"/> -->
          <graph-view :countCellDatas="propsCountCellDatas" />
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped>
.card-main-text {
  font-size: 10vmin;
}
.card {
  height: 100%;
  min-height: 250px;
}
.card-content {
  height: 70%;
  min-height: 90px;
  width: 100%;
  /* max-width: 100%; */
}
.pie-chart {
  width: 30%;
  /* height: 50%; */
  background-color: #fff;
}
</style>

<script>
import firebase from "firebase";
import GraphView from "@/components/GraphView.vue";
export default {
  components: {
    GraphView
  },
  data() {
    return {
      length: 3,
      onboarding: 0,
      countCellDatas: [
        {
          count: 0,
          task: "総合計時間"
        }
      ]
    };
  },
  async created() {
    //   console.log("wwww:", this.$store.state.user);
    if (this.$store.state.user) {
      const querySnapshot = await firebase
        .firestore()
        .collection(`users/${this.$store.getters.uid}/cellsInformation`)
        .get();
      // console.log(querySnapshot);
      querySnapshot.forEach(doc => {
        this.countCellDatas.push(doc.data());
        this.countCellDatas[0].count += doc.data().count;
      });
      // console.log(this.countCellDatas);
      // this.countCellDatas = { ...querySnapshot.data()};
      // console.log(this.countCellDatas);
    }
  },
  mounted() {
    console.log(this.$vuetify.breakpoint);
  },

  computed: {
    propsCountCellDatas() {
      return this.countCellDatas.map(countCellData => countCellData).slice(1);
    },
    viewportHeight() {
      let height = "";
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          height = "40%";
          break;
        case "sm":
          height = "40%";
          break;
        default:
          height = "80%";
      }
      return height;
    },
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "xs)220px";
        case "sm":
          return "sm)400px";
        case "md":
          return "md)500px";
        case "lg":
          return "lg)600px";
        case "xl":
          return "xl)800px";
      }
      return 0;
    }
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
    }
  },
  filters: {
    timeNotation(val) {
      let totalMinutes = val * 15;
      let hour = ("0" + Math.floor(totalMinutes / 60)).slice(-2);
      let minutes = ("0" + (totalMinutes % 60)).slice(-2);

      return `${hour}:${minutes}`;
    }
  }
};
</script>

