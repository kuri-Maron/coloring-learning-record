<template>
  <div class="about">
    <h1 class="mt-16">
      <span class="blue--text">Color学習記録アプリ</span> について
    </h1>
    <div v-if="!user" class="my-12">
      <h2 class="mt-8">アプリを利用するには？</h2>
      Googleアカウントでログインすることで利用できます。<br />
      画面右上からログインしてください。
    </div>

    <v-divider v-if="!user"></v-divider>

    <div class="my-12">
      <h2 class="mt-8">アプリの概要</h2>
      <a
        href="https://www.thg.co.jp/douyo/study/coloring_study/"
        target="_blank"
        rel="noopener noreferrer"
        >塗り絵勉強法</a
      >
      の考え方をもとにしたアプリです。<br />
      タスク実行時間を１５分単位とし、色塗り形式で記録するアプリです。<br />
      学習のサポートを目的としています。
    </div>
    <v-divider></v-divider>
    <div class="my-12">
      <h2 class="mt-8">各メニューの使い方</h2>
      <h3 class="mt-6">Color記録</h3>
      <p>
        実行したタスクについて１５分単位でColor記録できるメイン画面。
      </p>
      <ul>
        <li>実行するタスクは画面下部のタスク一覧から選択する</li>
        <li>マス目表の先頭からColor記録する</li>
        <li>１マスは１５分単位として記録する</li>
        <li>
          <span class="font-weight-bold">新規ページ</span
          >ボタンは、現時点の記録時間を実績として集計して、新規ページに切り替える
        </li>
      </ul>
      <h3 class="mt-6">タスク編集</h3>
      <p>Color記録をしたいタスクを作成・変更・削除ができる画面。</p>
      <ul>
        <li>
          Color割当中のタスク：
          Color記録ページで利用できるタスクをColorごとに設定できる
        </li>
        <li>他タスクの一覧： Color未割当のタスクを一覧表示する</li>
      </ul>
      <h3 class="mt-6">これまでの実績</h3>
      <p>
        Color記録ページで記録してきたタスク実行時間の合計実績を確認できる画面。
      </p>
      <ul>
        <li>Color割当中のタスクについて実績が確認できる</li>
        <li>数値と円グラフで表示される</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
export default {
  name: "About",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>
