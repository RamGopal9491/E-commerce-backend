const express = require('express');
const router = express.Router();
const { Cart } = require('../models/User');
const mongoose = require('mongoose');

// Example route (add your cart logic here)
router.get('/', (req, res) => {
  res.json({ msg: 'Cart route working' });
});

module.exports = router;
