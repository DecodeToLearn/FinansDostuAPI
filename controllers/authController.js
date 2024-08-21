const { db } = require('../config/firebase');
const admin = require('firebase-admin');

// Kullanıcı Kayıt (Register) İşlemi
const registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // Firebase Authentication ile kullanıcı oluşturma
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Kullanıcıyı veritabanında oluşturma
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set({
      id: userRecord.uid,
      email: userRecord.email,
      fullName: fullName || '',
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User registered successfully', userID: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı Girişi (Login) İşlemi
const loginUser = async (req, res) => {
  const { token } = req.body;

  try {
    // Token doğrulama
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userID = decodedToken.uid;

    // Kullanıcı bilgilerini döndürme
    const userDoc = await db.collection('users').doc(userID).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
