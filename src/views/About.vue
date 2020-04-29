<!-- 実装する際の試作するためのコンポーネント -->
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- 試作１ -->
    <Grid />
    <!-- <graph-view :countCellDatas="graphData"/> -->
  </div>
</template>

<script>
import Grid from "@/components/sample_grid.vue";
// import GraphView from "@/components/GraphView.vue";
export default {
  components: {
    Grid,
    // GraphView
  },
  data() {
    return {
      graphData: [
        {
          key: "January",
          value: 5,
          color: "red"
        },
        {
          key: "February",
          value: 2,
          color: "yellow"
        },
        {
          key: "March",
          value: 2,
          color: "blue"
        },
      ]
    }
  }
};
</script>
