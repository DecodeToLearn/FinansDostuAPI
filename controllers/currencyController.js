const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createCurrency = async (req, res) => {
  const { symbol, code, name } = req.body;

  try {
    const currencyRef = db.collection('currency').doc();
    await currencyRef.set({
      id: currencyRef.id,
      symbol,
      code,
      name,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Currency created successfully', currencyID: currencyRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCurrencies = async (req, res) => {
  try {
    const snapshot = await db.collection('currency').where('isDelete', '==', false).get();
    const currencies = snapshot.docs.map(doc => doc.data());
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrency = async (req, res) => {
  const currencyID = req.params.id;
  try {
    const currencyDoc = await db.collection('currency').doc(currencyID).get();
    if (!currencyDoc.exists) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.status(200).json(currencyDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCurrency = async (req, res) => {
  const currencyID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('currency').doc(currencyID).update(updates);
    res.status(200).json({ message: 'Currency updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCurrency = async (req, res) => {
  const currencyID = req.params.id;
  try {
    await db.collection('currency').doc(currencyID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Currency marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCurrency,
  getAllCurrencies,
  getCurrency,
  updateCurrency,
  deleteCurrency,
};
