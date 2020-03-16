<template>
  <div class="about">
    <h1>This is an about page</h1>
    <select-color/>
    <Grid/>
  </div>
</template>

<script>
import Grid from '@/components/sample_grid.vue';
import SelectColor from '@/components/selectColor.vue';
export default {
  components: {
    Grid,
    SelectColor
  }
}
</script>
