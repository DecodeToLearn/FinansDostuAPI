const express = require('express');
const router = express.Router();
const accountTypeController = require('../controllers/accountTypeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', accountTypeController.createAccountType);
router.get('/', accountTypeController.getAllAccountTypes);
router.get('/:id', accountTypeController.getAccountType);
router.put('/:id', accountTypeController.updateAccountType);
router.delete('/:id', accountTypeController.deleteAccountType);

module.exports = router;
