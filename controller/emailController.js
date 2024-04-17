// Para email com verificação de 2 etapas, ir em senhas app e criar um app de senha

const nodemailer  = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async(data,req,res) => {


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "italobasiliodasilva@gmail.com",
          pass: "utdebnrrqqflszgg",
        },
      });
      
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'Ecommerce Italo" <abc@email.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);

})

module.exports = sendEmail;