const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource.`,
      });
    }

    next();
  };
};

const requireAdmin = authorize('admin');
const requireFacultyOrAdmin = authorize('admin', 'faculty');
const requireStudent = authorize('student');

module.exports = {
  authorize,
  requireAdmin,
  requireFacultyOrAdmin,
  requireStudent,
};
