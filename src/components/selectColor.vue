<template>
  <div>
    <v-bottom-navigation
      app
      mandatory
      grow
      background-color="#121212"
      v-model="activeColor"
    >
      <v-btn
        v-ripple
        text
        :class="{ 'text-caption': $vuetify.breakpoint.xs }"
        v-for="colorObj in colorList"
        :color="colorObj.colorCode"
        :key="colorObj.taskText"
        :value="colorObj"
      >
        <span :style="{ color: colorObj.colorCode }" class="button_text">{{
          colorObj.taskText
        }}</span>
        <v-icon
          dense
          :color="
            activeColor.colorCode == colorObj.colorCode
              ? colorObj.colorCode
              : '#121212'
          "
          >mdi-pencil</v-icon
        >
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import MUTATION_TYPES from "@/store/mutation-types";
export default {
  computed: {
    // vuexのstateに現在アクティブなカラーオブジェクト情報を設定している
    activeColor: {
      get() {
        return this.$store.state.activeColor;
      },
      set(value) {
        this.$store.commit(MUTATION_TYPES.SET_ACTIVE_COLOR, value);
      },
    },
    colorList() {
      return this.$store.state.selecitngTasks;
    },
  },
};
</script>

<style scoped>
.button_text {
  /* width: 100%; */
  /* display: block; */
  width: 90px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
