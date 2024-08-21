const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', debtController.createDebt);
router.get('/', debtController.getAllDebts);
router.get('/:id', debtController.getDebt);
router.put('/:id', debtController.updateDebt);
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
