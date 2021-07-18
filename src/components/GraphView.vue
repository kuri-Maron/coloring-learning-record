<template>
  <!-- <div class="chart-container" style="position: relative; height:40vh; width:80vw"> -->
  <div class="chart-container">
    <button @click="increase()">Increase height</button>
    <pie-chart
      :chartData="chartData"
      :options="chartOptions"
      :styles="myStyles"
    />
    <!-- <p>{{ chartData }}</p> -->
  </div>
</template>

<script>
import PieChart from "@/chart/PieChart.js";
export default {
  components: {
    PieChart,
  },
  props: ["countCellDatas"],
  data() {
    return {
      height: 90,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    increase() {
      this.height += 10;
    },
  },
  computed: {
    myStyles() {
      return {
        height: `${this.height}%`,
        position: "relative",
      };
    },
    chartData() {
      const countData = this.countCellDatas.map((cellData) => {
        return cellData.count;
      });
      const dataColor = this.countCellDatas.map(
        (cellData) => cellData.colorCode
      );
      console.log("リアクティブ検証１：", countData);
      let obj = {
        labels: this.countCellDatas.map((cellData) => {
          return cellData.taskText;
        }),
        datasets: [],
      };
      this.$set(obj.datasets, 0, {
        // data: this.countCellDatas.map(cellData => {return cellData.count}),
        data: countData,
        label: "Sample1",
        backgroundColor: dataColor,
        borderWidth: 1,
      });
      // obj.datasets[0].data = this.countCellDatas.map(cellData => {return cellData.count});
      return obj;
    },
  },
};
</script>

<style scoped>
.chart-container {
  height: 100%;
}
</style>
