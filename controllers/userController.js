const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const generateToken = require('../utils/token');

// Registration
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, phone });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour

    await user.save();
    console.log('User Created!')

    const message = `Please verify your email by clicking the following link: http://${req.headers.host}/api/users/verify/${verificationToken}`;
    await sendEmail({ to: user.email, subject: 'Email Verification', text: message });

    res.json({ msg: 'Verification email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.isDeactivated) return res.status(403).json({ msg: 'Account is deactivated' });
    if (user.isLocked()) return res.status(403).json({ msg: 'Account is locked' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 3600000; // 1 hour
        await user.save();
        return res.status(403).json({ msg: 'Account locked due to multiple failed login attempts' });
      }
      await user.save();
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                    `http://${req.headers.host}/api/users/reset/${resetToken}\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail({ to: user.email, subject: 'Password Reset', text: message });

    res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password has been reset' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Upload Avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.avatar = req.file.filename;
    await user.save();

    res.json({ msg: 'Avatar uploaded', avatar: req.file.filename });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Deactivate User
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isDeactivated = true;
    await user.save();

    res.json({ msg: 'User account deactivated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reactivate User
exports.reactivateUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.isDeactivated) {
      user.isDeactivated = false;
      await user.save();
      res.json({ msg: 'User account reactivated' });
    } else {
      res.status(400).json({ msg: 'User account is not deactivated' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
