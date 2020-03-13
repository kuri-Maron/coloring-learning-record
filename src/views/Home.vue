<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Coloring/>
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
