<template>
  <div class="home">
    <select-color/>
    <!-- <Coloring/> -->
    <Coloring v-if="$store.state.user"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Coloring from "@/components/Coloring.vue";
import SelectColor from '@/components/selectColor.vue';
export default {
  name: 'Home',
  components: {
    SelectColor,
    Coloring
  }
}
</script>
