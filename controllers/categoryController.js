// controllers/categoryController.js
const Category = require('../models/Category');

// Process the categories to build a hierarchical structure
const buildHierarchy = (categories) => {
    const categoryMap = new Map();
    const result = [];

    // Create a map of all categories by their id
    categories.forEach(category => {
        categoryMap.set(category._id.toString(), { ...category._doc, children: [] });
    });

    // Build the hierarchical structure
    categories.forEach(category => {
        const { _id, parentId } = category;
        if (parentId) {
            const parent = categoryMap.get(parentId.toString());
            if (parent) {
                parent.children.push(categoryMap.get(_id.toString()));
            }
        } else {
            result.push(categoryMap.get(_id.toString()));
        }
    });

    return result;
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        // Validate that parent category exists if parentId is provided
        if (parentId) {
            const parentCategory = await Category.findById(parentId);
            if (!parentCategory) {
                return res.status(400).json({ msg: 'Parent category does not exist' });
            }
        }

        const category = new Category({ name, parentId });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parentId');
        const hierarchicalCategories = buildHierarchy(categories);
        res.status(200).json(hierarchicalCategories);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parentId');
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        // Validate that parent category exists if parentId is provided
        if (parentId) {
            const parentCategory = await Category.findById(parentId);
            if (!parentCategory) {
                return res.status(400).json({ msg: 'Parent category does not exist' });
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, parentId },
            { new: true, runValidators: true }
        );
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ msg: 'Invalid category ID' });
    }

    try {
        // Find the category and check if it exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Check for subcategories
        const subcategories = await Category.find({ parentId: categoryId });
        if (subcategories.length > 0) {
            return res.status(400).json({ msg: 'Cannot delete category with subcategories' });
        }

        // Delete the category
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ msg: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err); // Log error details
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get categories by parent category ID
exports.getCategoriesByParentId = async (req, res) => {
    try {
        const { parentId } = req.params;
        const categories = await Category.find({ parentId });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
