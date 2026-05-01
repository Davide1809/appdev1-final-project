// Middleware to check if user is authenticated AND is an admin
const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized - Please log in',
      code: 401
    });
  }

  if (req.session.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden - Admin access required',
      code: 403
    });
  }

  next();
};

module.exports = isAdmin;
