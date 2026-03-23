// middleware/auth.js
// Middleware = functions that run BETWEEN a request and response

// Protect routes - only logged-in users can access
const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    next(); // User is logged in, continue to the route
  } else {
    res.status(401).json({ message: 'Please log in to access this page' });
  }
};

// Role-based access - only specific roles allowed
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({
        message: `Role '${req.session.userRole}' is not authorized for this action`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
