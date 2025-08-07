/// routes/auth.js
const express = require('express');
const path = require('path');
const { handleLogin } = require('../controllers/login');
const { isAuthenticated } = require('../middleware/authenticator');


const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login', handleLogin);

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: `Welcome ${req.session.user.username}` }); // changed displayName to username
});

module.exports = router;

