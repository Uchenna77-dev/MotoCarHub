const isAuthenticated = (req, res, next) => {
  console.log('Checking auth:', req.session.user);
  if (!req.session.user) {
    return res.status(401).json({ message: 'You do not have access' });
  }
  next();
};

module.exports = { isAuthenticated };
//   if (!req.session.user || !['Admin', 'Manager'].includes(req.session.user.role)) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();

