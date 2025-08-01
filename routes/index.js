/// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const {isAuthenticated} = require('../middleware/authenticator');

const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html')); // Adjust path if needed
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: 'Invalid username or password' });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

  // Optional: restrict to Admins only
  if (user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden: Admins only' });

  // Store user in session
  req.session.user = {
    id: user._id,
    username: user.username,
    role: user.role
  };

  res.json({ message: 'Login successful', user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});


router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: `Welcome ${req.session.user.displayName}` });
});

module.exports = router;
