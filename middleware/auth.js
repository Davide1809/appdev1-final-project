// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized - Please log in',
      code: 401
    });
  }
};

module.exports = isAuthenticated;
