<template>
  <div>
    <v-row align="center" justify="center">
      <v-col class="text-center display-1">{{totalTime | timeNotation}}</v-col>
    </v-row>
    <div class="d-flex flex-wrap justify-center mainArea">
      <div
        v-for="(cell, index) in cellLists"
        class="flexItem"
        @click="selectCell(index)"
        :class="{ cellCheck: cell.isActive }"
        :style="{ 'background-color': cell.colorCode }"
        :key="index"
      ></div>
    </div>
    <v-btn type="button" @click="mergeCells()">マージ</v-btn>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Coloring",
  data() {
    return {
      cellLists: Array(32),
      notActiveObj: { isActive: false, task: "" }
      // totalTime: 0
    };
  },
  async created() {
    for (let i = 0; i < this.cellLists.length; i++) {
      this.$set(this.cellLists, i, this.notActiveObj);
    }
    //   コンポーネント生成時にuserが認証済かどうか判断したい。
    console.log("ユーザ認証状況は：", this.$store.state.user);
    // TODO: API通信が終わる前に一度レンダリングされる原因について
    await this.featchRecords();
  },
  mounted() {
    // 途中ログイン、ログアウト操作に画面も対応させるため？
    this.$store.watch(
      (state, getters) => getters.user,
      (newValue, oldValue) => {
        console.log("user changed! %s => %s", oldValue, newValue);
        this.featchRecords();
        console.log("mounted");
      }
    );
  },
  computed: {
    activeCellObj() {
      return {
        isActive: true,
        task: this.$store.state.activeColor.description,
        colorCode: this.$store.state.activeColor.colorCode
      };
    },
    totalTime() {
      return this.cellLists.filter(cell => {
        return cell.isActive === true;
      }).length;
    }
  },
  methods: {
    selectCell(index) {
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
          //   対象セルをアクティブにするTODO: 今後はタイムスタンプとかドキュメントID も格納するかも
          firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .add({
              ...this.activeCellObj,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            // .add({ isActive: true, task: "work" })
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
    // 認証チェックメソッド
    checkUserState() {
      console.log("ボタン押下::ユーザ認証状況は：", this.$store.state.user);
    },
    checkAnythig() {
      this.cellLists[0].task.get().then(doc => console.log(doc.data()));
    },
    async mergeCells() {
      alert("本当にリセットしますか？");
      // 本当は、トランザクション処理をするべき箇所。
      // forEachはasync,awaitに対応していない。

      //    this.cellLists.forEach(cell => {
      //   // cellにidがあるか判断する。
      //   if (('id' in cell)) {
      //     console.log("マージ処理実行開始");
      //       firebase
      //       .firestore()
      //       .collection(`users/${this.$store.getters.uid}/records`)
      //       .doc(cell.id)
      //       .update({
      //         isActive: false
      //       })
      //       .then(() => {
      //         cell.isActive = false;
      //       });
      //   }
      // });

      for (let cell of this.cellLists) {
        if ("id" in cell) {
          console.log("マージ処理実行開始");
          await firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .doc(cell.id)
            .update({
              isActive: false
            })
            .then(() => {
              cell.isActive = false;
            });
        }
      }

      location.reload();
    },
    firestoreReset() {},
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
  background-color: rgb(195, 233, 29);
}
input {
  border: solid;
}
div.flexBox {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
}
.flexItem {
  /* background-color: whitesmoke; */
  background-color: #424242;
  width: 24vw;
  /* height: 7vh; */
  border: solid 1px;
  border-color: #2e7d32;
}

.cellCheck {
  background-color: #98fb98;
}
</style>
