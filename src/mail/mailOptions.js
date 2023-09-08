async function getMailOptions(cliente, emailAnalista, qtdErros, newCsvFilePath, qtdUrls){
  let subject = ``;
  let porcentagemErros = (qtdErros*100) / qtdUrls;
  if(porcentagemErros==100){
    subject = `☠️ Para tudo o que você está fazendo! Todas as URLs de ${cliente} retornaram erro!`
  }else{
    if(porcentagemErros>=50){
      subject = `🚨 ATENÇÃO! ${qtdErros} erros foram encontrados na verificação do código-fonte de ${cliente}`    
    } else {
      if(qtdErros>0){
        subject = `😱 Eita! ${qtdErros} erros encontrados na verificação do código-fonte de ${cliente}`            
      }else{
        subject = `😎 Uhuu! Nenhum erro foi encontrado na verificação de código-fonte de ${cliente}`
      }
    }
  }

  const mailOptions = {
      from: 'bruno.ramos@webart.com.br',
      to: 'seo@webart.com.br',
      cc: [
        `${emailAnalista}`
      ],
      subject: subject,
      text: `Segue em anexo o arquivo .csv gerado pelo sistema com os dados da verificação`,
      attachments: [
        {
          filename: `${cliente}.csv`,
          path: newCsvFilePath
        }
      ]
    };
    
  return mailOptions;    
}
exports.getMailOptions = getMailOptions;