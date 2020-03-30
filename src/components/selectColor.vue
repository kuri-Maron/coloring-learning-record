<template>
  <div>
      <!-- <v-btn-toggle v-model="activeColorText" tile color="black" mandatory dense> -->
      <v-btn-toggle v-model="activeColorText" color="black" mandatory >
        <v-btn width="24.7vw" v-ripple v-for="colorObj in colorList" :key="colorObj.colorText" :value="colorObj" :color="colorObj.colorCode">
          {{colorObj.description}}
        </v-btn>
      </v-btn-toggle>
      <!-- <p>{{activeColorText}}</p> -->
  </div>
</template>

<script>
// import { commit } from "vuex";
export default {
  data() {
    return {
        colorList: [{colorText: "green", colorCode: "#98fb98", description: "（緑）勉強"},
                    {colorText: "blue", colorCode: "#B3E5FC", description: "（青）雑学"},
                    {colorText: "yellow", colorCode: "#FFF59D", description: "（黄）新挑戦"},
                    {colorText: "red", colorCode: "#FFCDD2", description: "（赤）筋トレ"},
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
