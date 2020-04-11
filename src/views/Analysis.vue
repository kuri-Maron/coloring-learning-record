<template>
  <v-sheet color="pink" max-height="90vh" height="89vh">
    <v-card class="ma-auto text-center" max-width="50vmin">
      {{ imageHeight }}
    </v-card>
    <v-row align="center" justify="space-around" style="height: 100%;">
      <v-col cols="10" sm="5">
        <v-card class="pa-2" :height="viewportHeight">
          <v-card-title>総合計時間</v-card-title>
          <div class="d-flex  align-center" style="height: 40%">
            <v-card-text class="display-2 text-center">HH : MM</v-card-text>
          </div>
        </v-card>
      </v-col>
      <v-col cols="10" sm="5">
        <v-card class="pa-2" :min-height="viewportHeight">円グラフ</v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  mounted() {
    console.log(this.$vuetify.breakpoint);
  },

  computed: {
    viewportHeight() {
      let height = "";
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          height = "35vh";
          break;
        default:
          height = "60vh";
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
    },
  },
};
</script>
