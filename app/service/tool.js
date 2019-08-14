const Service = require('egg').Service;
const nodemailer = require('nodemailer');
const {mailSet} = require('../../config.json');


const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: mailSet.email,
    pass: mailSet.password
  }
});

class ToolService extends Service {
  // 发送邮件
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: mailSet.email, // 发送者
      to: email, // 接收者。可以同时发送多个，以逗号隔开
      subject: subject, // 标题
      text: text, // 文本
      html: html
    }
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch(err) {
      return false;
    }
  }

  // 睡眠时间
  async sleepWait(time = 60000) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}

module.exports = ToolService;