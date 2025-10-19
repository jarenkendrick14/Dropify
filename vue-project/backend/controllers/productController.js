const Product = require('../models/Product');

// @desc    Fetch all products with filtering, searching, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Pagination parameters
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Filtering by category
    const filter = req.query.category ? { category: req.query.category } : {};

    // Searching by keyword
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    // Get the total count of documents that match the filter
    const total = await Product.countDocuments(filter);

    // Prepare the main query
    let query = Product.find(filter);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Apply pagination to the query
    query = query.skip((page - 1) * limit).limit(limit);

    // Execute the final query to get the products for the current page
    const products = await query;
    
    // Return a structured response
    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, price, image, category } = req.body;
  try {
    const product = new Product({ name, price, image, category });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, image, category } = req.body;
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.image = image;
      product.category = category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};