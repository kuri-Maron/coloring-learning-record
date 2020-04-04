<template>
  <div>
    <!-- 作業時間表示部 -->
    <v-row style="position: relative" align="center" justify="center">
      <v-col class="text-center display-1">
        {{
        totalTime | timeNotation
        }}
      </v-col>
      <v-dialog v-model="dialog" max-width="290">
        <template v-slot:activator="{ on }">
        <!-- 現在のcell情報をDBに格納して、リセットボタン -->
        <v-btn absolute right fab color="pink" type="button"  v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
      </template>
       <v-card>
        <v-card-title class="headline">合計時間に加算しますか？</v-card-title>
        <v-card-text>このページ内の合計時間を全期間データに集計して、ページをリセットします。</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
          <v-btn color="green darken-1" text @click="mergeCells(); dialog = false">Yes</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
    </v-row>

    <div class="d-flex flex-wrap justify-center mainArea">
      <!-- :class="{ cellCheck: cell.isActive }" を属性に含め、動的クラス可能 -->
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
import firebase from "firebase";
export default {
  name: "Coloring",
  data() {
    return {
      // 固定長の配列を定義
      cellLists: Array(32),
      // これはコードの重複を避けるために、定義したがdataオプションに定義しないほうが良いかも
      notActiveObj: { isActive: false, task: "" },
      dialog: false
    };
  },
  computed: {
    // vuexのstateの情報を元に、動的に生成
    activeCellObj() {
      return {
        isActive: true,
        task: this.$store.state.activeColor.description,
        colorCode: this.$store.state.activeColor.colorCode
      };
    },
    // 合計時間表示用
    totalTime() {
      return this.cellLists.filter(cell => {
        return cell.isActive === true;
      }).length;
    }
  },
  async created() {
    // 配列の長さしか定義されていないので、初期化
    for (let i = 0; i < this.cellLists.length; i++) {
      this.$set(this.cellLists, i, this.notActiveObj);
    }

    // TODO: API通信が終わる前に一度レンダリングされる原因について
    // firestoreにデータを取りに行く
    await this.featchRecords();
  },
  mounted() {
    // TODO: console.logを見ながら、今度動きを確認する
    // 途中ログイン、ログアウト操作に画面も対応させるため？
    this.$store.watch(
      (state, getters) => getters.user,
      (newValue, oldValue) => {
        console.log("user changed! %s => %s", oldValue, newValue);
        this.featchRecords();
      }
    );
  },
  methods: {
    selectCell(index) {
      // ログイン時のみ実行可能
      if (this.$store.state.user) {
        // 対象セルがアクティブの場合
        if (
          this.cellLists[index].isActive === true &&
          this.cellLists[index].id !== null
        ) {
          //   そのセルを削除して、配列の最後尾に非アクティブなセルを追加する
          firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .doc(this.cellLists[index].id)
            .delete()
            .then(() => {
              this.cellLists.splice(index, 1);
              this.cellLists.push(this.notActiveObj);
            });
          // 対象セルが非アクティブの場合
        } else if (index === 0 || this.cellLists[index - 1].isActive === true) {
          //   対象セルをアクティブにする
          firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .add({
              ...this.activeCellObj,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(doc => {
              this.$set(this.cellLists, index, {
                ...this.activeCellObj,
                id: doc.id
              });
            });
        }
      } else {
        alert("ログインしてくだい！");
      }
    },
    async mergeCells() {
      // forEachはasync非対応みたい
      for (let [index, cell] of this.cellLists.entries()) {
        // id属性が含まれているかチェック
        if ("id" in cell) {
          console.log("マージ処理実行開始");
          // 一個ずつ更新→ローカル反映しているが、もっといいロジックがあるかも
          await firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .doc(cell.id)
            // TODO: notActiveObjをthis.$setするほうがよくね
            .update({
              isActive: false
            })
            .then(() => {
              // もっと良い実装があるはず。
              this.$set(this.cellLists, index, this.notActiveObj);
            });
        }
      }
      // Promise.allの使い方把握しなければ
      // Promise.all(
      //   this.cellLists.forEach(async (cell, index) => {
      //     if ("id" in cell) {
      //       await firebase
      //         .firestore()
      //         .collection(`users/${this.$store.getters.uid}/records`)
      //         .doc(cell.id)
      //         .update({ isActive: false });
      //     console.log("awaitご");
      //     alert("stop");
      //         this.$set(this.cellLists,index,this.notActiveObj);
      //     }
      //   })
      // );
      // location.reload();
    },
    async featchRecords() {
      console.log("featchRecords");
      if (this.$store.state.user) {
        //   TODO: 取得する時、タイムスタンプの昇順で取得する必要がある。
        await firebase
          .firestore()
          .collection(`users/${this.$store.getters.uid}/records`)
          .where("isActive", "==", true)
          .orderBy("timeStamp")
          .get()
          .then(snapshot => {
            // console.log(`取得件数は、${snapshot.size}です。`);
            snapshot.docs.forEach((doc, index) => {
              this.$set(this.cellLists, index, {
                ...doc.data(),
                id: doc.id
              });
              // console.log("firestoreの値で更新", this.cellLists[index]);
            });
            console.log("データセット完了");
          });
        console.log("API取得完了？");
      } else {
        console.log("未ログインのためデータ取得する不可");
      }
    }
  },
  filters: {
    timeNotation(val) {
      let totalMinutes = val * 15;
      let hour = ("0" + Math.floor(totalMinutes / 60)).slice(-2);
      let minutes = ("0" + (totalMinutes % 60)).slice(-2);

      return `${hour}:${minutes}`;
    }
  }
};
</script>

<style scoped>
.mainArea {
  height: 70vh;
  /* background-color: rgb(195, 233, 29); */
}
.flexItem {
  /* もっと良いサイズ指定方法があるはず */
  width: 23vw;
  background-color: #424242;
  border: solid 1px;
  border-color: #607d8b;
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
