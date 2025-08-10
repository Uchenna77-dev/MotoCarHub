const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isAuthenticated} = require('../middleware/authenticator');

// Redirect /login to GitHub auth
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.send('✅ You are already logged in.');
  } else {
    // Redirect to GitHub for login
    res.redirect('/auth/github');
  }
});

// GitHub OAuth entry point
router.get('/auth/github', passport.authenticate('github'));

// GitHub OAuth callback
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: true }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Logout route
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    req.session.destroy();
    res.redirect('/');
  });
});

router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: `Welcome ${req.session.user.displayName}` });
});

module.exports = router;


/// routes/auth.js
// const express = require('express');
// const path = require('path');
// const { handleLogin } = require('../controllers/login');
// const { isAuthenticated } = require('../middleware/authenticator');


// const router = express.Router();

// router.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/login.html'));
// });

// router.post('/login', handleLogin);

// router.post('/logout', (req, res) => {
//   req.session.destroy();
//   res.json({ message: 'Logged out' });
// });

// router.get('/protected', isAuthenticated, (req, res) => {
//   res.json({ message: `Welcome ${req.session.user.username}` }); // changed displayName to username
// });

// module.exports = router;

