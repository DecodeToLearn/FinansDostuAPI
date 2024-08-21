const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const createReport = async (req, res) => {
  const { period, details, userID, type } = req.body;

  try {
    const reportRef = db.collection('reports').doc();
    await reportRef.set({
      id: reportRef.id,
      period,
      details,
      userID, // Kullanıcı ID'si doğrulamadan alınıyor
      type,
      isDelete: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Report created successfully', reportID: reportRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const snapshot = await db.collection('reports').where('isDelete', '==', false).get();
    const reports = snapshot.docs.map(doc => doc.data());
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReport = async (req, res) => {
  const reportID = req.params.id;
  try {
    const reportDoc = await db.collection('reports').doc(reportID).get();
    if (!reportDoc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(200).json(reportDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReport = async (req, res) => {
  const reportID = req.params.id;
  const updates = req.body;
  try {
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();
    await db.collection('reports').doc(reportID).update(updates);
    res.status(200).json({ message: 'Report updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReport = async (req, res) => {
  const reportID = req.params.id;
  try {
    await db.collection('reports').doc(reportID).update({
      isDelete: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: 'Report marked as deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReport,
  updateReport,
  deleteReport,
};
