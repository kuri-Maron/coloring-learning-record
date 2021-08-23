# カラー学習記録

[塗り絵勉強法](https://www.thg.co.jp/douyo/study/coloring_study/)の考え方をもとにしたアプリです。  
学習した時間を色塗り形式で記録することができます。  
学習継続のサポートを目的としています。  
（レスポンシブに対応しているため、PC・スマホのどちらからでも利用できます）

## URL

https://color-record-test.web.app

## 作成した目的

塗り絵勉強法は方眼紙とカラーマーカーで行いますが、PC・スマホでやりたいと考え作りました。  
アプリ化することで学習記録が蓄積しやすくなり、学習実績の確認が行いやすいようにしています。

## 使い方

### Color 記録（メイン画面）

<!-- ![使い方_color記録](https://user-images.githubusercontent.com/38233307/130372634-b4c6943b-de14-4d8c-9426-c3fe10f9be1a.gif) -->

![使い方_Color記録](https://user-images.githubusercontent.com/38233307/130373079-08a4bcf6-679c-43ba-8a3d-5c4d4cdb017e.gif)  
マス目に色をつけることで、学習時間を記録します。  
タスク別に、学習時間を１５分単位で記録します。

### タスク編集

![使い方_タスク編集](https://user-images.githubusercontent.com/38233307/130372910-43a23c4b-5b94-4508-8976-6bece483507a.png)
学習時間を記録したいタスクの登録・変更・削除ができます。

### これまでの実績

![使い方_これまでの実績](https://user-images.githubusercontent.com/38233307/130373318-5cf6da47-7810-4305-9859-7f88de9b9bd1.png)
実績データとして保存したタスクの学習時間を確認できます。

## 使用技術

<!-- TODO: バージョン情報を追記する -->

- Vue.js 2.6
- Vuetify 2.5
- Firebase 8.7
  - Authentication
  - Firestore
  - Hosting

## 機能一覧

- Google アカウントのログイン
- 学習時間の記録(マス目に色塗り)
- タスクの CRUD
- 学習時の実績績の照会(円グラフ)
