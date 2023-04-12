const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    console.log("mail", process.env.EMAIL, process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: "sgbhidbgeyryoxiq",
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
