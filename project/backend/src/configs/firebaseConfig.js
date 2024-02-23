require('dotenv').config({ path: '../.env' });
const firebaseAdmin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

module.exports = firebaseAdmin;