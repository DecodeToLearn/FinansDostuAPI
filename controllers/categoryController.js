const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createCategory = async (req, res) => {
  const { name, type, icon, userID } = req.body;

  try {
    const categoryRef = db.collection('categories').doc();
    await categoryRef.set({
      id: categoryRef.id,
      name,
      type,
      icon,
      userID,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Category created successfully', categoryID: categoryRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const snapshot = await db.collection('categories').where('isDelete', '==', false).get();
    const categories = snapshot.docs.map(doc => doc.data());
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategory = async (req, res) => {
  const categoryID = req.params.id;
  try {
    const categoryDoc = await db.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(categoryDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const categoryID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('categories').doc(categoryID).update(updates);
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status500().json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const categoryID = req.params.id;
  try {
    await db.collection('categories').doc(categoryID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Category marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
