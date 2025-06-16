import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

export const mailSender = async ({ email, subject, template, context }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SERVER_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".hbs",
        layoutsDir: "./src/template",
        defaultLayout: false,
        partialsDir: "./src/template",
      },
      viewPath: "./src/template",
      extName: ".hbs",
    })
  );

  const mailConfiguration = {
    from: "Innomart Official",
    to: email,
    subject,
    template,
    context,
  };

  transporter.sendMail(mailConfiguration, (error) => {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log("Email sent successfully");
    }
  });
};
