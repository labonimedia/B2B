const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.secureserver.net',
    port: 587,
    secure: false, // Use false as we're not using SSL, just STARTTLS
    auth: {
        user: 'noreply@fashiontradershub.com',
        pass: 'Goodwill#120',
    },
});

// Email details
const mailOptions = {
    from: 'noreply@fashiontradershub.com', // Sender address
    to: 'bhusnarsd@gmail.com', // Receiver address
    subject: 'Test Email', // Subject line
    text: 'This is a test email sent from the server.', // Plain text body
    html: '<p>This is a test email sent from the server.</p>', // HTML body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
