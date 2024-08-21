const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createAccountType = async (req, res) => {
  const { name, details, description } = req.body;

  try {
    const accountTypeRef = db.collection('accountTypes').doc();
    await accountTypeRef.set({
      id: accountTypeRef.id,
      name,
      details,
      description,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Account Type created successfully', accountTypeID: accountTypeRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAccountTypes = async (req, res) => {
  try {
    const snapshot = await db.collection('accountTypes').where('isDelete', '==', false).get();
    const accountTypes = snapshot.docs.map(doc => doc.data());
    res.status(200).json(accountTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccountType = async (req, res) => {
  const accountTypeID = req.params.id;
  try {
    const accountTypeDoc = await db.collection('accountTypes').doc(accountTypeID).get();
    if (!accountTypeDoc.exists) {
      return res.status(404).json({ error: 'Account Type not found' });
    }
    res.status(200).json(accountTypeDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccountType = async (req, res) => {
  const accountTypeID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('accountTypes').doc(accountTypeID).update(updates);
    res.status(200).json({ message: 'Account Type updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccountType = async (req, res) => {
  const accountTypeID = req.params.id;
  try {
    await db.collection('accountTypes').doc(accountTypeID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Account Type marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccountType,
  getAllAccountTypes,
  getAccountType,
  updateAccountType,
  deleteAccountType,
};
