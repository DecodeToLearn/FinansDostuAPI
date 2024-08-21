const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', reportController.createReport);
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReport);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
