const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  productImages: [{ type: String }], // Array of image URLs or paths
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to user
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
