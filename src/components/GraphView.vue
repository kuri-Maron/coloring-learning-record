<template>
  <div class="chart-container">
    <pie-chart
      :chart-data="chartData"
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
  props: ["countTaskListData"],
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
      const countData = this.countTaskListData.map(
        (taskData) => taskData.count
      );
      const dataColor = this.countTaskListData.map(
        (taskData) => taskData.colorCode
      );
      let obj = {
        labels: this.countTaskListData.map((taskData) => {
          return taskData.taskText;
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
