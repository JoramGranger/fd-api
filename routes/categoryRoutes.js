const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');


router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/parent/:parentId', categoryController.getCategoriesByParentId);
router.post('/', auth.protect, auth.admin, categoryController.createCategory);
router.put('/:id', auth.protect, auth.admin, categoryController.updateCategory);
router.delete('/:id', auth.protect, auth.admin, categoryController.deleteCategory);

module.exports = router;
