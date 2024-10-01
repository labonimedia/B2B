const nodemailer = require('nodemailer');

const smtpConfig = {
    host: 'smtp.secureserver.net',
    port: 587,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'noreply@fashiontradershub.com',
        pass: 'Goodwill#120', // Your email password
    },
};

const transporter = nodemailer.createTransport(smtpConfig);

const sendEmail = async (to, subject, text) => {
    const msg = {
        from: 'noreply@fashiontradershub.com',
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(msg);
        console.log('Email sent successfully:', info);
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

sendEmail('bhusnarsd@gmail.com', 'Test Subject', 'This is a test email.');
