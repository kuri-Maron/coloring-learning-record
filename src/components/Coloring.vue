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
          <v-btn absolute right fab color="pink" type="button" v-on="on"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline">合計時間に加算しますか？</v-card-title>
          <v-card-text
            >このページ内の合計時間を全期間データに集計して、ページをリセットします。</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false"
              >No</v-btn
            >
            <v-btn
              color="green darken-1"
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
        class="flexItem"
        :style="{ 'background-color': cell.colorCode }"
        :key="index"
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
      // 固定長の配列を定義
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
  },
  async created() {
    this.db = firebase.firestore();
    // TODO: API通信が終わる前に一度レンダリングされる原因について
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

      // forEachはasync非対応みたい
      // for (let [index, cell] of this.cellLists.entries()) {
      //   // id属性が含まれているかチェック
      //   if ("id" in cell) {
      //     console.log("マージ処理実行開始");
      //     // 一個ずつ更新→ローカル反映しているが、もっといいロジックがあるかも
      //     await firebase
      //       .firestore()
      //       .collection(`users/${this.$store.getters.uid}/records`)
      //       .doc(cell.id)
      //       // TODO: notActiveObjをthis.$setするほうがよくね
      //       .update({
      //         isActive: false,
      //       })
      //       .then(() => {
      //         // もっと良い実装があるはず。
      //         this.$set(this.cellLists, index, {});
      //       });
      //   }
      // }
    },
    async featchCells() {
      if (this.$store.state.user) {
        await this.db
          .collection(`users/${this.$store.getters.uid}/cells`)
          .orderBy("timeStamp")
          .get()
          .then((snapshot) => {
            // console.log(`取得件数は、${snapshot.size}です。`);
            snapshot.docs.forEach((doc, index) => {
              const docData = doc.data();
              this.$set(this.cellLists, index, {
                ...docData,
                colorCode: this.$store.state.mappingTaskandColor[
                  docData.taskId
                ],
                id: doc.id,
              });
              // console.log("firestoreの値で更新", this.cellLists[index]);
            });
            console.log("データセット完了");
          });
        console.log("API取得完了？");
      } else {
        console.log("未ログインのためデータ取得する不可");
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
  /* background-color: rgb(195, 233, 29); */
}
.flexItem {
  /* もっと良いサイズ指定方法があるはず */
  /* width: 23vw; */
  width: 23%;
  background-color: #424242;
  border: solid 1px;
  /* border-color: #607d8b; */
  border-color: #cfd8dc;
  opacity: 0.7;
}
/* 現状未使用： アドオンでアクティブセルのレイアウト作り込みするために利用 */
/* .cellCheck {
  background-color: #98fb98;
} */

/* 生cssでflexを実装する場合 */
/* div.flexBox {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
} */
</style>
