const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createAccount = async (req, res) => {
  const { name, balance, typeID, currencyID, subaccountID, userID } = req.body;

  try {
    const accountRef = db.collection('accounts').doc();
    await accountRef.set({
      id: accountRef.id,
      name,
      balance,
      typeID,
      currencyID,
      subaccountID,
      userID, // Kullanıcı ID'si
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Account created successfully', accountID: accountRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const snapshot = await db.collection('accounts').where('isDelete', '==', false).get();
    const accounts = snapshot.docs.map(doc => doc.data());
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccount = async (req, res) => {
  const accountID = req.params.id;
  try {
    const accountDoc = await db.collection('accounts').doc(accountID).get();
    if (!accountDoc.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(accountDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccount = async (req, res) => {
  const accountID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('accounts').doc(accountID).update(updates);
    res.status(200).json({ message: 'Account updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const accountID = req.params.id;
  try {
    await db.collection('accounts').doc(accountID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Account marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
