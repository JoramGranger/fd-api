const nodemailer = require('nodemailer');
const config = require('config');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
/*     service: config.get('email.service'), */
    host: 'mail.fortunederma.com',
    port: 465,
    secure: true,
    auth: {
      user: config.get('email.username'),
      pass: config.get('email.password')
    }
  });

  const mailOptions = {
    from: config.get('email.from'),
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
