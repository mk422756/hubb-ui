/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as functions from 'firebase-functions'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fireStore = admin.firestore()

exports.addUserToFirestore = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async user => {
    await fireStore
      .collection('user')
      .doc(user.uid)
      .set({ createdAt: new Date() })
  })

exports.deleteUserFromFirestore = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete(async user => {
    await fireStore
      .collection('user')
      .doc(user.uid)
      .delete()
  })
