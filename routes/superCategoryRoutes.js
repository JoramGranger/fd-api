const express = require('express');
const router = express.Router();
const superCategoryController = require('../controllers/superCategoryController');
const auth = require('../middleware/auth');

 // ptdr
router.post('/', auth.protect, auth.admin, superCategoryController.createSuperCategory);

// pr
router.get('/', superCategoryController.getSuperCategories);

// ar
router.put('/:id', auth.protect, auth.admin, superCategoryController.updateSuperCategory);
router.delete('/:id', auth.protect, auth.admin, superCategoryController.deleteSuperCategory);

module.exports = router;
