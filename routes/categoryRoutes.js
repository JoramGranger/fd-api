const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.post('/', auth.protect, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', auth.protect, categoryController.updateCategory);
router.delete('/:id', auth.protect, categoryController.deleteCategory);

module.exports = router;
