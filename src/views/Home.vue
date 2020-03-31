<template>
  <div class="home">
    <!-- TODO: コンポ間で判定もう一つ上の階層で表示制御してみる -->
    <!-- <div v-show="status"></div> -->
    <Coloring v-if="$store.state.user"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Coloring from "@/components/Coloring.vue";
export default {
  name: 'Home',
  components: {
    Coloring
  }
}
</script>
