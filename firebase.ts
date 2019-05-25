import admin from 'firebase-admin'
import config from './config'

const serviceAccount = require(config.SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.DB_URL,
})

export default admin