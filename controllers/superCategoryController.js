const SuperCategory = require('../models/SuperCategory');
const Category = require('../models/Category');

exports.createSuperCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newSuperCategory = new SuperCategory({ name });
    await newSuperCategory.save();
    res.json(newSuperCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getSuperCategories = async (req, res) => {
  try {
    const superCategories = await SuperCategory.find();
    res.json(superCategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateSuperCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const superCategory = await SuperCategory.findById(req.params.id);
    if (!superCategory) return res.status(404).json({ msg: 'SuperCategory not found' });

    superCategory.name = name || superCategory.name;
    await superCategory.save();
    res.json(superCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteSuperCategory = async (req, res) => {
  try {
    const superCategory = await SuperCategory.findById(req.params.id);
    if (!superCategory) return res.status(404).json({ msg: 'SuperCategory not found' });

    const subCategories = await Category.find({ superCategory: req.params.id });
    if (subCategories.length > 0) {
      return res.status(400).json({ msg: 'SuperCategory has subcategories and cannot be deleted' });
    }

    await superCategory.remove();
    res.json({ msg: 'SuperCategory removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
