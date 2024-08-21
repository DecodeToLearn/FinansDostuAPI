const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createExpense = async (req, res) => {
  const { date, amount, recurring, userID, accountID, typeID, currencyID, categoryID, subaccountID, paymentMethod, noteID } = req.body;

  try {
    const expenseRef = db.collection('expenses').doc();
    await expenseRef.set({
      id: expenseRef.id,
      date,
      amount,
      recurring,
      userID, // Kullanıcı ID'si doğrulamadan alınıyor
      accountID,
      typeID,
      currencyID,
      categoryID,
      subaccountID,
      paymentMethod,
      noteID,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Expense created successfully', expenseID: expenseRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const snapshot = await db.collection('expenses').where('isDelete', '==', false).get();
    const expenses = snapshot.docs.map(doc => doc.data());
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpense = async (req, res) => {
  const expenseID = req.params.id;
  try {
    const expenseDoc = await db.collection('expenses').doc(expenseID).get();
    if (!expenseDoc.exists) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(expenseDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  const expenseID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('expenses').doc(expenseID).update(updates);
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  const expenseID = req.params.id;
  try {
    await db.collection('expenses').doc(expenseID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Expense marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};
