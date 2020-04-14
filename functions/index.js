const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
// TODO: べき等を考慮して再実装。（frontで直でカウントしていく。＠task事にカウント分散。
exports.countUp = functions
  .region("asia-northeast1")
  .firestore.document("users/{user}/records/{record}")
  .onCreate((snapShot, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const userPath = context.params.user;
    const countTarget = snapShot.data().colorCode;

    return db.doc(`users/${userPath}/cellsInformation/cell_${countTarget}`).set(
      {
        count: FieldValue.increment(1),
        task: snapShot.data().task,
        colorCode: snapShot.data().colorCode,
      },
      { merge: true }
    );
    //   .update("docCount", FieldValue.increment(1));
  });

//   TODO: マイナス値のバリデーション実装が分からない。。。＠getとして値判断してみたいなことはできるかもしれんが、readコストが。。
exports.countDown = functions
  .region("asia-northeast1")
  .firestore.document("users/{user}/records/{record}")
  .onDelete((snapShot, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const userPath = context.params.user;
    const countTarget = snapShot.data().colorCode;

    return db.doc(`users/${userPath}/cellsInformation/cell_${countTarget}`).set(
      {
        count: FieldValue.increment(-1),
        task: snapShot.data().task,
        colorCode: snapShot.data().colorCode,
      },
      { merge: true }
    );
    //   .update("docCount", FieldValue.increment(1));
  });

//   トリガーされる順番が不確実だし、そもそもいきなりサブコレクション作ったとき発火しないっぽい
// exports.initUserInformation = functions
//   .region("asia-northeast1")
//   .firestore.document("users/{user}")
//   .onCreate((snapShot, context) => {
//     const userPath = context.params.user;
//     return db.doc(`users/${userPath}`).set({ docCount: 0 });
//   });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
