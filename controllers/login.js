const bcrypt = require('bcrypt');
const db = require('../db/connect'); // Your MongoClient connection

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.getDb().db('vehicles').collection('users').findOne({ username });

    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    if (user.role !== 'Admin' && user.role !== 'Manager') {
      return res.status(403).json({ message: 'Forbidden: Admins or Managers only' });
    }

    // Save session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    res.json({ message: 'Login successful', user: req.session.user });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { handleLogin };
