const nodemailer = require("nodemailer");

const sendEmail = async ({from, to, subject, text, html})=>{
    
    
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASSWORD, 
        },
    });

    let info = await transporter.sendMail({
        from, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });

}

module.exports = {sendEmail};