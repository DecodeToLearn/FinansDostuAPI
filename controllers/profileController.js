const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createProfile = async (req, res) => {
  const {
    fullName,
    address,
    gender,
    userID,
    phone,
    dob,
    nickname,
    currencyID,
    preferredLanguage,
    profilePicture,
    securitySettings,
    notificationPreferences
  } = req.body;

  try {
    const profileRef = db.collection('profiles').doc();
    await profileRef.set({
      id: profileRef.id,
      fullName,
      address,
      gender,
      phone,
      dob,
      nickname,
      currencyID,
      preferredLanguage,
      profilePicture,
      userID,
      securitySettings, // Güvenlik ayarları
      notificationPreferences, // Bildirim ayarları
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection('users').doc(userID).update({
      profileID: profileRef.id,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Profile created successfully', profileID: profileRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const snapshot = await db.collection('profiles').where('isDelete', '==', false).get();
    const profiles = snapshot.docs.map(doc => doc.data());
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  const profileID = req.params.id;
  try {
    const profileDoc = await db.collection('profiles').doc(profileID).get();
    if (!profileDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profileDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const profileID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('profiles').doc(profileID).update(updates);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  const profileID = req.params.id;
  try {
    await db.collection('profiles').doc(profileID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: 'Profile marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
};
