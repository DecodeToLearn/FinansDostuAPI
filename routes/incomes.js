const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', incomeController.createIncome);
router.get('/', incomeController.getAllIncomes);
router.get('/:id', incomeController.getIncome);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
