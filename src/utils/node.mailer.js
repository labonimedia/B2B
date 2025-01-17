const nodemailer = require('nodemailer');

async function sendTestEmail() {
    try {
        // Create the transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.secureserver.net',
            port: 587,
            secure: false, // Use false for STARTTLS
            auth: {
                user: 'noreply@fashiontradershub.com',
                pass: 'Goodwill#120',
            },
        });

        // Define the email options
        const mailOptions = {
            from: 'noreply@fashiontradershub.com', // Sender address
            to: 'bhusnarsd@gmail.com', // Receiver address
            subject: 'Test Email', // Subject
            text: 'This is a test email sent from the server.', // Plain text
            html: '<p>This is a test email sent from the server.</p>', // HTML content
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Execute the function
sendTestEmail();
