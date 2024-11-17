import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailWithCredentials = async (to: string, email: string, password: string): Promise<void> => {
  try {
    const templatePath = path.resolve('src', 'helpers', 'mail_template.ejs');
    const html = await ejs.renderFile(templatePath, { email, password });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Mourya Urja Matrimonial Account Credentials',
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
