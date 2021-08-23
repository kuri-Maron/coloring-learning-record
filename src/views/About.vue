<template>
  <div class="about">
    <h1 class="mt-16">
      <span class="blue--text">Color学習記録アプリ</span> について
    </h1>
    <!-- <div v-if="!user" class="my-12"> -->
    <div v-show="!user" class="my-12">
      <h2 class="mt-8">アプリを利用するにはログインしてください</h2>
      Googleアカウントでログインすることで利用できます。<br />
      <div>
        <div id="firebaseui-auth-container" class="d-inline-flex ml-n12"></div>
      </div>
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
      学習した時間を色塗り形式で記録することができます。<br />
      学習継続のサポートを目的としています。<br />
      （レスポンシブに対応しているため、PC・スマホのどちらからでも利用できます）
    </div>
    <v-divider></v-divider>
    <div class="my-12">
      <h2 class="mt-8">各メニューの使い方</h2>
      <h3 class="mt-6">Color記録</h3>
      <p>
        学習したタスクについて１５分単位で記録できるメイン画面。
      </p>
      <ul>
        <li>記録するタスクは画面下部のタスク一覧から選択する</li>
        <li>マス目表の先頭から記録する</li>
        <li>１マスは１５分単位として記録する</li>
        <li>
          <span class="font-weight-bold">+新規ページ</span
          >ボタンは、現時点の記録時間を実績として集計して、新規ページに切り替える
        </li>
      </ul>
      <h3 class="mt-6">タスク編集</h3>
      <p>学習時間を記録したいタスクの作成・変更・削除ができる画面。</p>
      <ul>
        <li>
          カラー割当中のタスク：
          Color記録ページで選択できるタスクを色ごとに設定できる
        </li>
        <li>他タスクの一覧： カラー未割当のタスクを一覧表示する</li>
      </ul>
      <h3 class="mt-6">これまでの実績</h3>
      <p>
        Color記録ページで記録してきたタスク実行時間の合計実績を確認できる画面。
      </p>
      <ul>
        <li>カラー割当中のタスクについて学習時間の実績が確認できる</li>
        <li>数値と円グラフで表示される</li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "About",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    // googoleサインインボタンの生成
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    let uiConfig = {
      signInFlow: "popup",
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>
