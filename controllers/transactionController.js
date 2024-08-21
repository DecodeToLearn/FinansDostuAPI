const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createTransaction = async (req, res) => {
  const { date, amount, userID, accountID, subaccountID, linkedID, type, currencyID, noteID } = req.body;

  try {
    const transactionRef = db.collection('transactions').doc();
    await transactionRef.set({
      id: transactionRef.id,
      date,
      amount,
      userID, // Kullanıcı ID'si doğrulamadan alınıyor
      accountID,
      subaccountID,
      linkedID,
      type,
      currencyID,
      noteID,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Transaction created successfully', transactionID: transactionRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const snapshot = await db.collection('transactions').where('isDelete', '==', false).get();
    const transactions = snapshot.docs.map(doc => doc.data());
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransaction = async (req, res) => {
  const transactionID = req.params.id;
  try {
    const transactionDoc = await db.collection('transactions').doc(transactionID).get();
    if (!transactionDoc.exists) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transactionDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  const transactionID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('transactions').doc(transactionID).update(updates);
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  const transactionID = req.params.id;
  try {
    await db.collection('transactions').doc(transactionID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Transaction marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
