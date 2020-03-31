<!-- 実装する際の試作するためのコンポーネント -->
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- 試作１ -->
    <Grid />
  </div>
</template>

<script>
import Grid from "@/components/sample_grid.vue";
export default {
  components: {
    Grid
  }
};
</script>
