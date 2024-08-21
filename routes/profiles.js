const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', profileController.createProfile);
router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfile);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);

module.exports = router;
