const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');

exports.protect = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, config.get('jwt.secret'));
    req.user = decoded.user;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ msg: 'Authorization denied' });
    if (user.isDeactivated) return res.status(403).json({ msg: 'Account is deactivated' });
    if (user.isLocked()) return res.status(403).json({ msg: 'Account is locked' });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.admin = (req, res, next) => {
   // Debugging statement
/*    console.log('User role:', req.user);
   console.log('User role:', req.user.role); */
  
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
};
