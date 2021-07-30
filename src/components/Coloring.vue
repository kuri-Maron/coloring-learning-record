<template>
  <div>
    <!-- 作業時間表示部 -->
    <v-row style="position: relative" align="center" justify="center">
      <v-col class="text-center display-1">
        {{ totalTime | timeNotation }}
      </v-col>
      <v-dialog v-model="dialog" max-width="290">
        <template v-slot:activator="{ on }">
          <!-- 現在のcell情報をDBに格納して、リセットボタン -->
          <v-btn absolute right color="pink" type="button" v-on="on">
            <v-icon>mdi-plus</v-icon>新規ページ</v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline"
            >記録を保存して、新しいページにしますか？</v-card-title
          >
          <v-card-text
            >このページ内の合計時間を分析用データとして集計します。分析メニューから実績データを確認できます。</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">No</v-btn>
            <v-btn
              color="primary"
              text
              @click="
                mergeCells();
                dialog = false;
              "
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- v-responsiveとGridの組み合わせで下記みたいに無理やり折り返さなくても升目組めるかも（vuetifyのgridのDocment -->
    <div class="d-flex flex-wrap justify-center mainArea">
      <div
        v-for="(cell, index) in cellLists"
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
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  name: "Coloring",
  data() {
    return {
      // 固定長の配列を定義。記録するセル数だけ定義
      cellLists: Array(32).fill({}),
      dialog: false,
      db: null,
    };
  },
  computed: {
    // vuexのstateの情報を元に、動的に生成
    activeCellObj() {
      return {
        taskId: this.$store.state.activeColor.taskId,
        colorCode: this.$store.state.activeColor.colorCode,
      };
    },
    // 合計時間表示用
    totalTime() {
      return this.cellLists.filter((cell) => {
        return "taskId" in cell;
      }).length;
    },
    // 次にカラーをセットできるセルのインデックス
    nextSettableCell() {
      return this.cellLists.findIndex((value) => {
        return !("id" in value);
      });
    },
    // CSS変数で動的に制御するための変数
    styleActiveColor() {
      return {
        "--color-code": this.activeCellObj.colorCode,
      };
    },
  },
  async created() {
    this.db = firebase.firestore();
    // firestoreからデータ取得
    await this.featchCells();
  },
  mounted() {
    // TODO: console.logを見ながら、今度動きを確認する
    // 途中ログイン、ログアウト操作に画面も対応させるため？
    this.$store.watch(
      (state, getters) => getters.user,
      (newValue, oldValue) => {
        console.log("user changed! %s => %s", oldValue, newValue);
        this.featchCells();
      }
    );
  },
  methods: {
    // セルのクリック時の動作。カラー登録か削除。
    selectCell(index) {
      // ログイン時のみ実行可能
      if (this.$store.state.user) {
        // 対象セルがアクティブの場合
        if (
          "taskId" in this.cellLists[index] &&
          this.cellLists[index].id !== null
        ) {
          //   そのセルを削除して、配列の最後尾に非アクティブなセルを追加する

          this.db
            .collection(`users/${this.$store.getters.uid}/cells`)
            .doc(this.cellLists[index].id)
            .delete()
            .then(() => {
              this.cellLists.splice(index, 1);
              this.cellLists.push({});
            });
          // 対象セルが非アクティブの場合
        } else if (index === 0 || "taskId" in this.cellLists[index - 1]) {
          //   対象セルをアクティブにする
          this.db
            .collection(`users/${this.$store.getters.uid}/cells`)
            .add({
              // ...this.activeCellObj,
              taskId: this.activeCellObj.taskId,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((doc) => {
              this.$set(this.cellLists, index, {
                ...this.activeCellObj,
                id: doc.id,
              });
            });
        }
      } else {
        alert("ログインしてください！");
      }
    },
    // 分析用データとして保存し、新しいページにする。
    mergeCells() {
      let batch = this.db.batch();
      this.cellLists.forEach((cell) => {
        if ("id" in cell) {
          let cellDocRef = this.db
            .collection(`users/${this.$store.getters.uid}/cells`)
            .doc(cell.id);
          batch.delete(cellDocRef);

          let taskDocRef = this.db
            .collection(`users/${this.$store.getters.uid}/taskList`)
            .doc(cell.taskId);
          batch.update(taskDocRef, {
            count: firebase.firestore.FieldValue.increment(1),
          });
        }
      });
      batch
        .commit()
        .then(() => {
          console.log("バッチでの削除処理＆タスクのインクリメント完了");
          this.cellLists.splice(
            0,
            this.cellLists.length,
            ...Array(32).fill({})
          );
        })
        .catch((err) => console.log(err));
    },
    // ＤＢからセル情報を取得
    async featchCells() {
      if (this.$store.state.user) {
        await this.db
          .collection(`users/${this.$store.getters.uid}/cells`)
          .orderBy("timeStamp")
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc, index) => {
              const docData = doc.data();
              this.$set(this.cellLists, index, {
                ...docData,
                colorCode: this.$store.state.mappingTaskandColor[
                  docData.taskId
                ],
                id: doc.id,
              });
            });
          });
      } else {
        alert("ログインしてください。");
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
