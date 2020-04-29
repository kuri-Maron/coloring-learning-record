<template>
  <!-- <div class="chart-container" style="position: relative; height:40vh; width:80vw"> -->
  <div class="chart-container" >
    <pie-chart :chartData="chartData" :options="chartOptions"/>
    <!-- <p>{{ chartData }}</p> -->
  </div>
</template>


<script>
import PieChart from "@/chart/PieChart.js";
export default {
  components: {
    PieChart
  },
  props: ["countCellDatas"],
  // data() {
  //   return {
  //     chartData: {
  //       labels: ["A","B","C"],
  //       datasets: [
  //         {
  //           label: "Sample1",
  //           data: [5,3,1],
  //           backgroundColor: ["#3F51B5","#4CAF50","pink"],
  //           borderWidth: 1
  //         }
  //       ]
  //     }
  //   };
  // },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },

  computed: {
    chartData() {
      const countData = this.countCellDatas.map(cellData => {
        return cellData.count;
      });
      const dataColor = this.countCellDatas.map(cellData => cellData.colorCode);
      console.log("リアクティブ検証１：", countData);
      let obj = {
        labels: this.countCellDatas.map(cellData => {
          return cellData.task;
        }),
        datasets: [
          // {
          //   label: "Sample1",
          //   // data: this.countCellDatas.map(cellData => {return cellData.count}),
          //   data: [8,9],
          //   // backgroundColor: this.countCellDatas.map(cellData => cellData.colorCode),
          //   backgroundColor: ["red","blue"],
          //   borderWidth: 1
          // }
        ]
      };
      this.$set(obj.datasets, 0, {
        // data: this.countCellDatas.map(cellData => {return cellData.count}),
        data: countData,
        label: "Sample1",
        backgroundColor: dataColor,
        borderWidth: 1
      });
      // obj.datasets[0].data = this.countCellDatas.map(cellData => {return cellData.count});
      return obj;
    }
  }

  // created() {
  //   console.log("###: ",this.countCellDatas);
  //   // ラベルのセット
  //   this.chartData.labels = this.countCellDatas.map(cellData => {
  //     return cellData.key;
  //   });

  //   // 値のセット
  //   this.chartData.datasets[0].data = this.countCellDatas.map(cellData => {
  //     return cellData.value;
  //   });

  //   // backgroundColorのセット
  //   this.chartData.datasets[0].backgroundColor = this.countCellDatas.map(cellData => {
  //     return cellData.color;
  //   });
  // }
};
</script>

<style scoped></style>
