/* eslint-disable @typescript-eslint/no-var-requires */
import * as functions from 'firebase-functions'
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
export default admin
