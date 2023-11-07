const nodemailer = require('nodemailer');
async function createTransport(){

    const transporter = nodemailer.createTransport({        
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'seu-email-aqui',
          pass: 'coloque-a-senha-de-aplicativo-aqui'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      return transporter;

};

exports.createTransport = createTransport;