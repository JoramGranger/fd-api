const Category = require('../models/Category');
const Product = require('../models/Product'); // Assuming you have a Product model

exports.createCategory = async (req, res) => {
  const { name, superCategoryId } = req.body;
  try {
    const newCategory = new Category({ name, superCategory: superCategoryId });
    await newCategory.save();
    res.json(newCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('superCategory', 'name');
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateCategory = async (req, res) => {
  const { name, superCategoryId } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });

    category.name = name || category.name;
    category.superCategory = superCategoryId || category.superCategory;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });

    const products = await Product.find({ category: req.params.id });
    if (products.length > 0) {
      return res.status(400).json({ msg: 'Category has products and cannot be deleted' });
    }

    await category.remove();
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
