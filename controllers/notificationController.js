const sendEmail = require('../utilities/email');

exports.sendNotification = async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        if (!to || !subject || !text) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        await sendEmail({ to, subject, text });
        res.status(200).json({ msg: 'Notification sent successfully' });
    } catch (err) {
        console.error('Error sending notification:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
