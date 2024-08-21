const admin = require('firebase-admin');

// Firebase Admin SDK'nın yapılandırma dosyasını yükle
const serviceAccount = require('../firebase-adminsdk.json');

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'finansdostu.appspot.com' // Realtime Database kullanıyorsanız
  // storageBucket: 'your-project-id.appspot.com' // Storage kullanıyorsanız
});

const db = admin.firestore();

module.exports = { admin, db };
