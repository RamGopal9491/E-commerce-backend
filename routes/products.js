// Route to get 4 products with the highest discount

require('dotenv').config();
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary config (set your credentials in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });

// Route to add a new product with image upload
router.post('/add', upload.array('images', 5), async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // console.log("first")
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { name, originPrice, discountPrice, quantity, category, description } = req.body;

    // Get Cloudinary URLs from uploaded files
    const productImages = req.files.map(file => file.path);

    const product = new Product({
      name,
      originPrice,
      discountPrice,
      quantity,
      category,
      description,
      productImages,
      userId
    });
    await product.save();
    res.status(201).json({ msg: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
router.get('/high-discount', async (req, res) => {
  try {
    // Calculate discount percentage and sort
    const products = await Product.aggregate([
      {
        $addFields: {
          discountPercent: {
            $multiply: [
              { $divide: [{ $subtract: ["$originPrice", "$discountPrice"] }, "$originPrice"] },
              100
            ]
          }
        }
      },
      { $sort: { discountPercent: -1 } },
      { $limit: 4 }
    ]);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;