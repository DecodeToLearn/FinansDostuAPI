const admin = require('firebase-admin');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Firebase Admin SDK json dosyanı buraya ekle
const serviceAccount = require('./firebase-adminsdk.json');

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Tüm koleksiyonları JSON formatında dışa aktarma fonksiyonu
async function exportCollections() {
  const collections = await db.listCollections();
  let allData = {};

  for (const collection of collections) {
    const snapshot = await collection.get();
    let collectionData = [];

    snapshot.forEach(doc => {
      collectionData.push({ id: doc.id, ...doc.data() });
    });

    allData[collection.id] = collectionData;
  }

  // JSON dosyasını Downloads klasörüne kaydet
  const filePath = path.join(os.homedir(), 'Downloads', 'firestoreData.json');
  fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));

  console.log(`Veriler başarıyla ${filePath} konumuna kaydedildi.`);
}

// Script'i çalıştır
exportCollections().catch(console.error);
