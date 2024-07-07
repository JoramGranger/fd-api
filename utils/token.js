const jwt = require('jsonwebtoken');
const config = require('config');

const generateToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, config.get('jwt.secret'), { expiresIn: config.get('jwt.expiry') });
};

module.exports = generateToken;