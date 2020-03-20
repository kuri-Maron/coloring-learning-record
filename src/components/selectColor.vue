<template>
  <div>
    <v-col cols="12" sm="6" class="py-2">
      <v-btn-toggle v-model="activeColorText" tile color="black" mandatory dense>
        <!-- <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group> -->
        <v-btn v-for="colorObj in colorList" :key="colorObj.colorText" :value="colorObj" :color="colorObj.colorCode">
        <!-- <v-btn value="green" color="#DCEDC8" elevation="15"> -->
          {{colorObj.description}}
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
        // colorList: ["green","blue","yellow","red"],
        colorList: [{colorText: "green", colorCode: "#98fb98", description: "（緑）勉強"},
                    {colorText: "blue", colorCode: "#B3E5FC", description: "（青）雑学"},
                    {colorText: "yellow", colorCode: "#FFF59D", description: "（黄）新挑戦"},
                    {colorText: "red", colorCode: "#FFCDD2", description: "（赤）筋トレ"},
        ],
        // TODO: こいつをvuexのstateに移植。
      activeColorText: "red"
    };
  },
  // TODO: これいらない説。最初から、各カラーObjで定義する
  computed: {
      // colorObj() {
      //     let colorObj = {};
      //     switch(this.activeColorText){
      //         case this.activeColorText[0]:
      //             colorObj = {colorText: this.activeColorText[0]};
      //             break;
      //     }
      //     return colorObj;
      // }
  },
  watch: {

  }
};
</script>
