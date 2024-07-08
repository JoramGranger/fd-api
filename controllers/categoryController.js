const Category = require('../models/Category');
/* const Product = require('../models/Product'); */

// Create Category
exports.createCategory = async (req, res) => {
  const { name, parentCategory } = req.body;
  try {
    const newCategory = new Category({ name, parentCategory });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory', 'name');
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get Category By ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentCategory', 'name');
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  const { name, parentCategory } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });

    category.name = name || category.name;
    category.parentCategory = parentCategory || category.parentCategory;
    await category.save();

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });

    // Check for subcategories
    const subcategories = await Category.find({ parentCategory: category._id });
    if (subcategories.length > 0) {
      return res.status(400).json({ msg: 'Cannot delete category with subcategories' });
    }

    // Check for products
    const products = await Product.find({ category: category._id });
    if (products.length > 0) {
      return res.status(400).json({ msg: 'Cannot delete category with products' });
    }

    await category.remove();
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
