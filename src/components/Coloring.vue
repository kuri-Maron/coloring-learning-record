<template>
  <div>
    <div class="flexBox">
      <div
        v-for="(cell, index) in cellLists"
        class="flexItem"
        @click="selectCell(index)"
        :class="{ cellCheck: cell.isActive }"
        :key="index"
      >{{ `index:${index} val:${cell.isActive}` }}</div>
    </div>
    <button @click="checkAnythig()">なんでもチェック！</button>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Coloring",
  data() {
    return {
      cellLists: Array(12)
    };
  },
  created() {
    for (let i = 0; i < this.cellLists.length; i++) {
      this.$set(this.cellLists, i, { isActive: false, task: "none" });
    }
    //   コンポーネント生成時にuserが認証済かどうか判断したい。
    console.log("ユーザ認証状況は：", this.$store.state.user);
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters.user,
      (newValue, oldValue) => {
        console.log("user changed! %s => %s", oldValue, newValue);
        // console.log(firebase.auth().currentUser,this.$store.state.user);
        if (this.$store.state.user) {
          firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .get()
            .then(snapshot => {
              snapshot.docs.forEach((doc, index) => {
                this.$set(this.cellLists, index, {
                  ...doc.data(),
                  id: doc.id
                  //   id: doc.id,
                  //   cell: doc.data()
                });
                console.log("firestoreの値で更新", this.cellLists[index]);
              });
            });
        } else {
          console.log("未ログインのためデータ取得する不可");
        }
      }
    );
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
              this.cellLists.push({ isActive: false, task: "none" });
            });
          // 対象セルが非アクティブの場合
        } else if (index === 0 || this.cellLists[index - 1].isActive === true) {
          //   対象セルをアクティブにするTODO: 今後はタイムスタンプとかドキュメントID も格納するかも
          firebase
            .firestore()
            .collection(`users/${this.$store.getters.uid}/records`)
            .add({ isActive: true, task: "work" })
            .then(doc => {
              this.$set(this.cellLists, index, {
                isActive: true,
                task: "work",
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
        // this.cellLists[0].task.
    }
  }
};
</script>

<style scoped>
div.flexBox {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
}

.flexItem {
  background-color: whitesmoke;
  width: 24vw;
  border: solid 1px;
}

.cellCheck {
  background-color: palegreen;
}
</style>
