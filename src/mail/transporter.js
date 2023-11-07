const nodemailer = require('nodemailer');
async function createTransport(){

    const transporter = nodemailer.createTransport({        
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'bruno.ramos@webart.com.br',
          pass: 'dpsotytmlpzepluu'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      return transporter;

};

exports.createTransport = createTransport;