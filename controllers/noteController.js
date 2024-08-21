const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createNote = async (req, res) => {
  const { content, relatedEntity, relatedID } = req.body;

  try {
    const noteRef = db.collection('notes').doc();
    await noteRef.set({
      id: noteRef.id,
      content,
      relatedEntity,
      relatedID,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Note created successfully', noteID: noteRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const snapshot = await db.collection('notes').where('isDelete', '==', false).get();
    const notes = snapshot.docs.map(doc => doc.data());
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNote = async (req, res) => {
  const noteID = req.params.id;
  try {
    const noteDoc = await db.collection('notes').doc(noteID).get();
    if (!noteDoc.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(noteDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNote = async (req, res) => {
  const noteID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('notes').doc(noteID).update(updates);
    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  const noteID = req.params.id;
  try {
    await db.collection('notes').doc(noteID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Note marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
};
