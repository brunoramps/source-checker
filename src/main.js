const fs = require('fs');
const csvParser = require('csv-parser');
const { sendMail } = require('./mail/sendmail');
const { gravarCsv } = require('./csv/gravarCsv');
const { scrapData } = require('./scrapper/scrap');

async function main(cliente) {
  const urls = [];
  
  // Lendo o arquivo CSV e coletando as URLs
  fs.createReadStream(`arquivos/${cliente}.csv`)
    .pipe(csvParser())
    .on('data', (data) => {
      if (data.url) {
        urls.push(data.url);
      }
    })
    .on('end', async () => {

      //Realizando coleta de dados
      const results = await scrapData(urls);
      // Escrevendo os resultados em um novo arquivo CSV
      const newCsv = await gravarCsv(cliente, results);
      //Enviando o e-mail
      sendMail(cliente, newCsv.newCsvFilePath, newCsv.qtdErros, results.length);
    });
}

//main();

exports.main = main;