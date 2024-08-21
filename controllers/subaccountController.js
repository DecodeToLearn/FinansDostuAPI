const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createSubaccount = async (req, res) => {
  const { name, balance, accountID, currencyID, typeID, userID } = req.body;

  try {
    const subaccountRef = db.collection('subaccounts').doc();
    await subaccountRef.set({
      id: subaccountRef.id,
      name,
      balance,
      accountID,
      currencyID,
      typeID,
      userID, // Kullanıcı ID'si doğrulamadan alınıyor
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Subaccount created successfully', subaccountID: subaccountRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSubaccounts = async (req, res) => {
  try {
    const snapshot = await db.collection('subaccounts').where('isDelete', '==', false).get();
    const subaccounts = snapshot.docs.map(doc => doc.data());
    res.status(200).json(subaccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubaccount = async (req, res) => {
  const subaccountID = req.params.id;
  try {
    const subaccountDoc = await db.collection('subaccounts').doc(subaccountID).get();
    if (!subaccountDoc.exists) {
      return res.status(404).json({ error: 'Subaccount not found' });
    }
    res.status(200).json(subaccountDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubaccount = async (req, res) => {
  const subaccountID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('subaccounts').doc(subaccountID).update(updates);
    res.status(200).json({ message: 'Subaccount updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSubaccount = async (req, res) => {
  const subaccountID = req.params.id;
  try {
    await db.collection('subaccounts').doc(subaccountID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Subaccount marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSubaccount,
  getAllSubaccounts,
  getSubaccount,
  updateSubaccount,
  deleteSubaccount,
};
