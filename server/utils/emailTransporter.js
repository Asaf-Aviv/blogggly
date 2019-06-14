const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransport({
  service: 'porkbun',
  host: 'smtp.porkbun.com',
  type: 'SMTP',
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS,
  },
});

emailTransporter.sendForgotPassword = function (email, username, resetToken) {
  const template = {
    from: process.env.EMAIL_ADDR,
    to: email,
    subject: 'Blogggly Reset Password Request',
    text: forgotPasswordTemplate(username, resetToken, true),
    html: forgotPasswordTemplate(username, resetToken),
  };

  return this.sendMail(template);
};

emailTransporter.sendResetPasswordConfirmation = function (email, username) {
  const date = new Date().toGMTString();

  const template = {
    from: process.env.EMAIL_ADDR,
    to: email,
    subject: 'Blogggly password changed',
    text: resetPasswordTemplate(username, date, true),
    html: resetPasswordTemplate(username, date),
  };

  return this.sendMail(template);
};

function forgotPasswordTemplate(username, resetToken, text) {
  return text
    ? `
      Hi ${username}, Here's how to reset your password.
    
      We have received a request to have your password reset for blogggly.com. 
      If you did not make this request, please ignore this email.
    
      To reset your password, please copy this url to your browser
      http://localhost:3000/reset/${resetToken}
    
      Note that this link will expire in 10 minutes.
    
      ${templateFooter()}
    `
    : `
      <h1>Hi ${username}, Here's how to reset your password.</h1>
      <p>We have received a request to have your password reset for <b>blogggly.com</b>.
      If you did not make this request, please ignore this email.</p> 
      <p>To reset your password, please <a href="http://localhost:3000/reset/${resetToken}"/>visit this link.</a></p>
      <strong>Note that this link will expire in 10 minutes.</strong>
      ${templateFooter(text)}
    `;
}

function resetPasswordTemplate(username, date, text) {
  return text
    ? `
      Hi ${username}, Your password has been changed.

      This is a confirmation that your password was changed at ${date}.

      ${templateFooter()}
    `
    : `
      <h1>Hi ${username}, Your password has been changed.</h1>
      <p>This is a confirmation that your password was changed at ${date}.</p>
      ${templateFooter(text)}
    `;
}

function templateFooter(text) {
  return text
    ? `
      Questions?

      Remember let us know if there's anything we can help you with by sending an email to support@blogggly.com.

      Remember that Blogggly will never ask for your password and will always refer to you by your username.
    `
    : `
      <h3>Questions?</h3>
      <p>Please let us know if there's anything we can help you with by sending an email to <strong>support@blogggly.com</strong>.</p>
      <p>Remember that <strong>Blogggly</strong> will never ask for your password and will always refer to you by your username.</p>
    `;
}

module.exports = emailTransporter;
