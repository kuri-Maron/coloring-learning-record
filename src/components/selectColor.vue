<template>
  <div>
      <!-- <v-btn-toggle v-model="activeColorText" color="black" mandatory > -->
      <v-bottom-navigation app horizontal background-color="#121212" grow v-model="activeColorText" color="black" mandatory >
        <v-btn v-ripple outlined v-for="colorObj in colorList" :key="colorObj.colorText" :value="colorObj" :color="colorObj.colorCode">
          <span>{{colorObj.description}}</span>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <!-- </v-btn-toggle> -->
  </div>
</template>

<script>
// import { commit } from "vuex";
export default {
  data() {
    return {
        colorList: [{colorText: "green", colorCode: "#4CAF50", description: "（緑）勉強", icon: "radiobox-marked"},
                    {colorText: "blue", colorCode: "#3F51B5", description: "（青）雑学"},
                    {colorText: "yellow", colorCode: "#FFAB00", description: "（黄）新挑戦"},
                    {colorText: "red", colorCode: "#C62828", description: "（赤）筋トレ"},
        ],
        // TODO: こいつをvuexのstateに移植。
      // activeColorText: "red"
    };
  },
  // TODO: これいらない説。最初から、各カラーObjで定義する
  computed: {
      activeColorText: {
        get() {
          return this.$store.state.activeColor;
        },
        set(value) {
          console.log('セッター呼び出し！');
          this.$store.commit('setColor',value);
          // this.$store.state.commit('setColor',value);
        }
      }
  },
  watch: {

  }
};
</script>
