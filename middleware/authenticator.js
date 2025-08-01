function isAuthenticated(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'Admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

module.exports = { isAuthenticated };

