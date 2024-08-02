// Registration
exports.register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'This Email is already registered' });
  
      user = new User({ name, email, password, phone, role });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      const verificationToken = crypto.randomBytes(20).toString('hex');
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
  
      await user.save();
  
      // Create a corresponding customer entry if role is 'user'
      if (role === 'user') {
        const customer = new Customer({ userId: user._id });
        await customer.save();
      }
  
      const message = `Please verify your email by clicking the following link: http://${req.headers.host}/api/users/verify/${verificationToken}`;
      await sendEmail({ to: user.email, subject: 'Email Verification', text: message });
  
      res.json({ msg: 'Verification email sent' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };