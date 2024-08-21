const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createDebt = async (req, res) => {
  const { amount, purpose, userID, accountID, debtor, creditor, typeID, currencyID, due_date, paymentSchedule } = req.body;

  try {
    const debtRef = db.collection('debts').doc();
    await debtRef.set({
      id: debtRef.id,
      amount,
      purpose,
      userID, // Kullanıcı ID'si doğrulamadan alınıyor
      accountID,
      debtor,
      creditor,
      typeID,
      currencyID,
      due_date,
      paymentSchedule,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Debt created successfully', debtID: debtRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDebts = async (req, res) => {
  try {
    const snapshot = await db.collection('debts').where('isDelete', '==', false).get();
    const debts = snapshot.docs.map(doc => doc.data());
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDebt = async (req, res) => {
  const debtID = req.params.id;
  try {
    const debtDoc = await db.collection('debts').doc(debtID).get();
    if (!debtDoc.exists) {
      return res.status(404).json({ error: 'Debt not found' });
    }
    res.status(200).json(debtDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDebt = async (req, res) => {
  const debtID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('debts').doc(debtID).update(updates);
    res.status(200).json({ message: 'Debt updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDebt = async (req, res) => {
  const debtID = req.params.id;
  try {
    await db.collection('debts').doc(debtID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Debt marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDebt,
  getAllDebts,
  getDebt,
  updateDebt,
  deleteDebt,
};
