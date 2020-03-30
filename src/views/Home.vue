<template>
  <div class="home">
    <!-- <select-color/> -->
    <!-- <Coloring/> -->
    <!-- TODO: コンポ間で判定 -->
    <!-- <div v-show="status"></div> -->
    <Coloring v-if="$store.state.user"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Coloring from "@/components/Coloring.vue";
// import SelectColor from '@/components/selectColor.vue';
export default {
  name: 'Home',
  components: {
    // SelectColor,
    Coloring
  }
}
</script>
