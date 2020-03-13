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
  </div>
</template>

<script>
export default {
    name: "Coloring",
    data() {
        return {
            cellLists: Array(12)
        }
    },
    created() {
        for (let i = 0; i < this.cellLists.length; i++) {
      this.$set(this.cellLists, i, { isActive: false, task: "none" });
    }
    },
      methods: {
    selectCell(index) {
        // 対象セルがアクティブの場合
      if (this.cellLists[index].isActive === true) {
        //   そのセルを削除して、配列の最後尾に非アクティブなセルを追加する
        this.cellLists.splice(index, 1);
        this.cellLists.push({ isActive: false, task: "none" });
        // 対象セルが非アクティブの場合
      } else if (index === 0 || this.cellLists[index - 1].isActive === true) {
        //   対象セルをアクティブにするTODO: 今後はタイムスタンプとかドキュメントID も格納するかも
        this.$set(this.cellLists,index,{isActive: true, task: "work"});
        // this.cellLists[index].isActive = true;
        // this.cellLists[index].task = "work";
      }
    this.$emit('count-active-blocks',this.countActiveBlocks.length);
    }
  },
}
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
