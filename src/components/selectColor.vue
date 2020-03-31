<template>
  <div>
    <!-- 背景色は、ダークテーマの背景と同一の物を選択 ,color=属性は反映できない(各ボタンのoutlinedと競合している)-->
    <v-bottom-navigation
      app
      mandatory
      background-color="#121212"
      grow
      v-model="activeColorText"
      color="purple"
    >
      <!-- TODO: ボタン内のテキストとアイコンをレスポンシブ対応にする。(固定テキスト蝶のみにしか対応できていない) -->
      <v-btn
        :class="{ caption: $vuetify.breakpoint.xs }"
        v-ripple
        outlined
        v-for="colorObj in colorList"
        :key="colorObj.colorText"
        :value="colorObj"
        :color="colorObj.colorCode"
      >
        <span>{{ colorObj.description }}</span>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // TODO: firesotreに元情報を格納して、ユーザ毎に設定可能にしたい
      colorList: [
        { colorText: "green", colorCode: "#4CAF50", description: "勉強" },
        { colorText: "blue", colorCode: "#3F51B5", description: "雑学" },
        { colorText: "yellow", colorCode: "#FFAB00", description: "新挑戦" },
        { colorText: "red", colorCode: "#C62828", description: "筋トレ" }
      ]
    };
  },
  computed: {
    // vuexのstateに現在アクティブなカラーオブジェクト情報を設定している
    activeColorText: {
      get() {
        return this.$store.state.activeColor;
      },
      set(value) {
        this.$store.commit("setColor", value);
      }
    }
  }
};
</script>
