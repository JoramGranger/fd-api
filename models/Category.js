const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Category', categorySchema);
