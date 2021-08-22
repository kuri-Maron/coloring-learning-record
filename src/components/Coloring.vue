<template>
  <div>
    <!-- 作業時間表示部 -->
    <v-row style="position: relative" align="center" justify="center">
      <v-col class="text-center display-1">
        {{ totalTime | timeNotation }}
      </v-col>
      <v-dialog v-model="dialog" max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn absolute right color="pink" type="button" v-on="on">
            <v-icon>mdi-plus</v-icon>新規ページ</v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline"
            >記録を保存して、新しいページにしますか？</v-card-title
          >
          <v-card-text
            >現在のページ内の合計時間を実績データとして集計します。「これまでの実績」メニューからデータを確認できます。</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"
              >キャンセル</v-btn
            >
            <v-btn
              color="primary"
              text
              @click="
                mergeCellList();
                dialog = false;
              "
              >実行</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- v-responsiveとGridの組み合わせで下記みたいに無理やり折り返さなくても升目組めるかも（vuetifyのgridのDocment -->
    <div class="d-flex flex-wrap justify-center mainArea">
      <div
        v-for="(cell, index) in cellList"
        :class="[
          'flexItem',
          cell.id ? 'colorItem' : '',
          index === nextSettableCell ? 'nextSettableCell' : '',
        ]"
        :style="{
          ...styleActiveColor,
          'background-color': cell.colorCode,
        }"
        :key="cell.id"
        @click="selectCell(index)"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Coloring",
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    // vuexからcellListを取得
    cellList() {
      return this.$store.state.cellList;
    },
    // 合計時間表示用
    totalTime() {
      return this.$store.state.cellList.filter((cell) => {
        return "taskId" in cell;
      }).length;
    },
    // 次にカラーをセットできるセルのインデックス
    nextSettableCell() {
      return this.$store.state.cellList.findIndex((value) => {
        return !("id" in value);
      });
    },
    // CSS変数で動的に制御するための変数
    styleActiveColor() {
      return {
        "--color-code": this.$store.state.activeColor.colorCode,
      };
    },
  },
  methods: {
    ...mapActions(["deleteCell", "addCell", "mergeCellList"]),
    // セルのクリック時の動作。カラーセル追加か削除。
    selectCell(index) {
      // 対象セルがアクティブの場合
      if (
        "taskId" in this.cellList[index] &&
        this.cellList[index].id !== null
      ) {
        //   そのセルを削除して、配列の最後尾に非アクティブなセルを追加する
        this.deleteCell(index);
        // 対象セルが非アクティブの場合
      } else if (index === 0 || "taskId" in this.cellList[index - 1]) {
        //   対象セルをアクティブにする
        this.addCell(index);
      }
    },
  },
  filters: {
    timeNotation(val) {
      let totalMinutes = val * 15;
      let hour = ("0" + Math.floor(totalMinutes / 60)).slice(-2);
      let minutes = ("0" + (totalMinutes % 60)).slice(-2);
      return `${hour}:${minutes}`;
    },
  },
};
</script>

<style scoped>
.mainArea {
  height: 70vh;
}
.flexItem {
  /* もっと良いサイズ指定方法があるはず */
  /* width: 23vw; */
  width: 23%;
  background-color: #424242;
  border: solid 1px;
  border-color: #cfd8dc;
  opacity: 0.7;
}
.colorItem:hover {
  opacity: 0.5;
  cursor: pointer;
}
.nextSettableCell:hover {
  border-color: var(--color-code);
  border-width: 2px;
}

/* 生cssでflexを実装する場合 */
/* div.flexBox {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
} */
</style>
