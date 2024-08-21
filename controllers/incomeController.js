const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createIncome = async (req, res) => {
  const { date, amount, recurring, userID, accountID, typeID, currencyID, categoryID, subaccountID, noteID } = req.body;

  try {
    const incomeRef = db.collection('incomes').doc();
    await incomeRef.set({
      id: incomeRef.id,
      date,
      amount,
      recurring,
      userID, // Kullanıcı ID'si doğrulamadan alınıyor
      accountID,
      typeID,
      currencyID,
      categoryID,
      subaccountID,
      noteID,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Income created successfully', incomeID: incomeRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllIncomes = async (req, res) => {
  try {
    const snapshot = await db.collection('incomes').where('isDelete', '==', false).get();
    const incomes = snapshot.docs.map(doc => doc.data());
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getIncome = async (req, res) => {
  const incomeID = req.params.id;
  try {
    const incomeDoc = await db.collection('incomes').doc(incomeID).get();
    if (!incomeDoc.exists) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.status(200).json(incomeDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIncome = async (req, res) => {
  const incomeID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('incomes').doc(incomeID).update(updates);
    res.status(200).json({ message: 'Income updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteIncome = async (req, res) => {
  const incomeID = req.params.id;
  try {
    await db.collection('incomes').doc(incomeID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Income marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createIncome,
  getAllIncomes,
  getIncome,
  updateIncome,
  deleteIncome,
};
