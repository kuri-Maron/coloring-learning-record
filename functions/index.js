const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.countUp = functions
  .region("asia-northeast1")
  .firestore.document("users/{user}/records/{record}")
  .onCreate((change, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const userPath = context.params.user;

    return db
      .doc(`users/${userPath}`)
      .update("docCount", FieldValue.increment(1));
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
