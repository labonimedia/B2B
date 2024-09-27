const nodemailer = require('nodemailer');

// SMTP configuration for GoDaddy
const smtpConfig = {
    host: 'smtp.secureserver.net', // GoDaddy SMTP server
    port: 587, // SSL port
secure: false, // true for 465, false for other ports
    auth: {
      user: 'noreply@fashiontradershub.com',
      pass: 'Goodwill#120', // Your email password
    },
  };

// Create a Nodemailer transport
const transport = nodemailer.createTransport(smtpConfig);

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  const msg = {
    from: 'noreply@fashiontradershub.com', // Sender address
    to, // Recipient address
    subject, // Subject line
    text, // Plain text body
  };

  try {
    const info = await transport.sendMail(msg);
    console.log('Email sent successfully:', info);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

// Example usage
sendEmail('bhusnarsd@gmail.com', 'Test Subject', 'This is a test email body.')
  .then(() => console.log('Email sent'))
  .catch(err => console.error('Failed to send email:', err));
