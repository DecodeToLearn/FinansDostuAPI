const express = require('express');
const router = express.Router();
const subaccountController = require('../controllers/subaccountController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', subaccountController.createSubaccount);
router.get('/', subaccountController.getAllSubaccounts);
router.get('/:id', subaccountController.getSubaccount);
router.put('/:id', subaccountController.updateSubaccount);
router.delete('/:id', subaccountController.deleteSubaccount);

module.exports = router;
