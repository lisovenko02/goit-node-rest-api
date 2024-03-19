import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();

const { META_PASSWORD, FROM_EMAIL } = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure:true,
    auth: {
        user: FROM_EMAIL,
        pass: META_PASSWORD
    }
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async(data) => {
    const mail = {
        ...data,
        from: FROM_EMAIL,
    };

    await transporter.sendMail(mail);

    return true;
}

export default sendEmail;

