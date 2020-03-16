<template>
  <div>
    <v-col cols="12" sm="6" class="py-2">
      <p>Text Options</p>

      <v-btn-toggle v-model="activeColorText" tile color="black" mandatory dense>
        <!-- <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group> -->
        <v-btn value="green" color="#DCEDC8">
        <!-- <v-btn value="green" color="#DCEDC8" elevation="15"> -->
          （緑）勉強
        </v-btn>

        <v-btn value="blue" color="#B3E5FC">
          （青）座学
        </v-btn>

        <v-btn value="yellow" color="#FFF59D">
          （黄）新挑戦
        </v-btn>

        <v-btn value="red" color="#FFCDD2">
          （赤）筋トレ
        </v-btn>
      </v-btn-toggle>
      <p>{{activeColorText}}</p>
    </v-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
        colorList: ["green","blue","yellow","red"],
      activeColorText: "green"
    };
  },
  computed: {
      colorObj() {
          let colorObj = {};
          switch(this.activeColorText){
              case this.activeColorText[0]:
                  colorObj = {colorText: this.activeColorText[0]};
                  break;
          }
          return colorObj;
      }
  },
  watch: {

  }
};
</script>
