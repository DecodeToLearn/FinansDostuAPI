const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', currencyController.createCurrency);
router.get('/', currencyController.getAllCurrencies);
router.get('/:id', currencyController.getCurrency);
router.put('/:id', currencyController.updateCurrency);
router.delete('/:id', currencyController.deleteCurrency);

module.exports = router;
