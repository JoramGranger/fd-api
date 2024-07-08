const express = require('express');
const router = express.Router();
const superCategoryController = require('../controllers/superCategoryController');
const auth = require('../middleware/auth');

router.post('/', auth.protect, superCategoryController.createSuperCategory);
router.get('/', superCategoryController.getSuperCategories);
router.put('/:id', auth.protect, superCategoryController.updateSuperCategory);
router.delete('/:id', auth.protect, superCategoryController.deleteSuperCategory);

module.exports = router;
