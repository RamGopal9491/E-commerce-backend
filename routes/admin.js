const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

// Route to check if user is admin
router.get('/isAdmin', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isAdmin: false, msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ isAdmin: false, msg: 'User not found' });
    }
    console.log(user.admin)
    res.json({ isAdmin: !!user.admin });
  } catch (err) {
    res.status(401).json({ isAdmin: false, msg: 'Token is not valid' });
  }
});

module.exports = router;
