const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DepartmentMentor = require('../models/DepartmentMentor');

const protect = async (req, res, next) => {
  let token;

  console.log('=== authMiddleware called ===');
  console.log('URL:', req.originalUrl);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'MISSING');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Token extracted, length:', token.length);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('JWT verified successfully, user id:', decoded.id);

      req.user = await User.findById(decoded.id).select("-password");
      console.log('User fetched:', req.user ? `${req.user.name} (${req.user.role})` : 'NULL');

      // mentors must be assigned to a department or they cannot use protected areas
      if (req.user.role === 'mentor') {
        console.log('User is mentor, checking department assignment...');
        const assignment = await DepartmentMentor.findOne({ mentorId: req.user._id });
        if (!assignment) {
          console.log('ERROR: Mentor not found in DepartmentMentor');
          return res.status(403).json({ message: 'Mentor not linked to a department' });
        }
        // attach department to request for convenience
        req.user.department = assignment.department;
        console.log('Mentor department assigned:', assignment.department);
      }
      console.log('authMiddleware: Calling next()');
      next();
    } catch (error) {
      console.error('authMiddleware ERROR:', error.message);
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    console.log('authMiddleware: No Bearer token found');
    return res.status(401).json({ message: "No token" });
  }
};

module.exports = protect;
