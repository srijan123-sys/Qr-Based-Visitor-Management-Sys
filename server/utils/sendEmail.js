const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Generate a temporary fake email account on the fly using Ethereal
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create transporter using the fake Ethereal account
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass, 
    },
  });

  // 3. Define email options
  const mailOptions = {
    from: '"QR-Pass Admin" <admin@qr-pass.local>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 4. Send email
  const info = await transporter.sendMail(mailOptions);

  // 5. Get the URL to view the fake email online
  const previewUrl = nodemailer.getTestMessageUrl(info);
  
  // Return it so the controller can send it to the frontend!
  return previewUrl;
};

module.exports = sendEmail;
