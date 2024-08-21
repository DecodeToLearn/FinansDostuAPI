const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('isDelete', '==', false).get();
    const users = snapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const userID = req.params.id;
  try {
    const userDoc = await db.collection('users').doc(userID).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const userID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(userID).update(updates);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userID = req.params.id;
  try {
    await db.collection('users').doc(userID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: 'User marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
