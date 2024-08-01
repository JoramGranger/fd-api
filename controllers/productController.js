const multer = require('multer');
const Product = require('../models/Product');
/* const upload = multer({ dest: 'uploads/products/'}); */
// create

exports.createProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock } = req.body;
        const image = req.file ? req.file.path : '';
        console.log('Request body', req.body);
        console.log('file path', image);
        const product = new Product({ name, description, category, price, stock, image});
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
        const {name, description, price, category, stock} = req.body;
        const updateData = { name, description, price, category, stock};

        if (req.file) {
            updateData.image = req.file.path;
        }

        //const image = req.file ? req.file.path : '';
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
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
exports.extractProducts = async (req, res) => {
    console.log('Request received'); // Debugging line
    console.log('Query parameters:', req.query); // Debugging line
    try {
        const q  = req.query;
        console.log('Search query:', q); // Debugging line
        if (!q) {
            return res.status(400).json({ msg: 'Query parameter is required' });
        }

        const regex = new RegExp(q, 'i'); 
        console.log('Regex for search:', regex); // Debugging line

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
        const {stock} = req.body;
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

    /* exports.updateProductStock = async (req, res) => {
        console.log('Request body:', req.body); // Debugging line
        console.log('Request params ID:', req.params.id); // Debugging line
    
        try {
            const { stock } = req.body; // Extract stock from request body
            
            // Validate stock value
            if (typeof stock !== 'number' || stock < 0) {
                return res.status(400).json({ msg: 'Invalid stock value' });
            }
    
            // Find the product by ID
            const product = await Product.findById(req.params.id);
            
            if (!product) return res.status(404).json({ msg: 'Product not found' });
            
            // Update the stock field
            product.stock = stock;
            
            // Save the updated product
            await product.save();
            
            res.status(200).json(product);
        } catch (err) {
            console.error('Error updating product stock:', err); 
            res.status(500).json({ msg: 'Server error' });
        }
    };  */   