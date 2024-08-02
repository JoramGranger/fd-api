// models/Category.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Category name is required'],
        unique: [true, 'Category name must be unique'],
        trim: true
    },
    parentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        default: null
    }
});

// Add an index to parentId to optimize parent-child relationship queries
CategorySchema.index({ parentId: 1 });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
