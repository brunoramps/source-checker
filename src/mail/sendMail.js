const { getEmailAnalista } = require('./analista');
const { createTransport } = require('./transporter');
const { getMailOptions } = require('./mailOptions');

// Enviando o arquivo CSV via e-mail
async function sendMail(cliente,newCsvFilePath, qtdErros, qtdUrls){

    //criando o transporter
    const transporter = await createTransport();
    //pegando o email do analista
    const emailAnalista = await getEmailAnalista(cliente);
    //definindo as config de email
    const mailOptions = await getMailOptions(cliente, emailAnalista, qtdErros, newCsvFilePath, qtdUrls);
    //enviando o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
        } else {
            console.log("Email enviado para o analista: ", emailAnalista);
            console.log('E-mail enviado:', info.response);
        }
      });
}

exports.sendMail = sendMail;