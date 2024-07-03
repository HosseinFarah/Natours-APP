const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.url = url;
    this.firstName = user.name.split(" ")[0];
    this.to = user.email;
    this.from = `HosseinFarahKordmahaleh<${process.env.MAIL_FROM}>`;
  }
  newTransporter() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS,
        },
      });
    } else if (process.env.NODE_ENV === "development") {
      return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    }
  }
  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    await this.newTransporter().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to Natours family App!");
  }
  async sendResetPassword() {
    await this.send("resetPassword", "Reset password LINK active for 10 min!");
  }
};
