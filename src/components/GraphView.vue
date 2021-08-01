<template>
  <div class="chart-container">
    <pie-chart
      :chartData="chartData"
      :options="chartOptions"
      :styles="myStyles"
    />
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
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    myStyles() {
      return {
        height: "100%",
        position: "relative",
      };
    },
    chartData() {
      const countData = this.countCellDatas.map((cellData) => cellData.count);
      const dataColor = this.countCellDatas.map(
        (cellData) => cellData.colorCode
      );
      let obj = {
        labels: this.countCellDatas.map((cellData) => {
          return cellData.taskText;
        }),
        datasets: [],
      };
      this.$set(obj.datasets, 0, {
        data: countData,
        backgroundColor: dataColor,
        borderWidth: 1,
      });
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
