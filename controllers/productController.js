const Product = require('../models/Product');

// create

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, image} = req.body;
        const product = new Product({ name, description, price, description, price, category, stock, image});
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};

// return all
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};

// single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({msg: 'Product not found'});
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};

// update

exports.updateProduct = async (req, res) => {
    try {
        const {name, description, price, category, stock, image} = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, stock, image },
            { new: true, runValidators: true }
        );
        if(!product) return res.status(404).json({ msg: 'Product not found'});
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json({msg: 'Server Error'});
    }
};

// purge
exports.deleteProduct =  async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({msg: 'Product not found'});
        res.status(200).json({msg: 'Product Deleted Successfully'})
    } catch (err) {
        res.status(500).json({msg: 'Server Error'});
    }
};

// search
exports.searchProducts = async (req, res) => {
    try {
      const { q } = req.query;
      console.log('Search query:', q);
      if (!q) {
        return res.status(400).json({ msg: 'Query parameter is required' });
      }
  
      const regex = new RegExp(q, 'i'); 
      console.log('Regex for search:', regex);
      const products = await Product.find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex }
        ]
      });  
      res.status(200).json(products);
    } catch (err) {
      console.error('Error occurred during product search:', err); 
      res.status(500).json({ msg: 'Server error' });
    }
  };

// category sort
exports.getProductsByCategory = async(req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({msg: 'Server Error'});
    }
};

// stock
exports.updateProductStock = async (req, res) => {
    try {
        const {stock} = req.params.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true, runValidators: true }
        );
        if(!product) return res.status(404).json({msg: 'Product not found'});
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({msg: 'Server error '});
    }
}