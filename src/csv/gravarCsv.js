const fs = require('fs');
const moment = require('moment');

async function gravarCsv(cliente, results){

    const today = moment().format('YYYY-MM-DD');
    let qtdErros = 0;

    const newCsvFilePath = `resultados/${cliente}.csv`;
      const newCsvStream = fs.createWriteStream(newCsvFilePath);
      newCsvStream.write('URL,pageTitle,titleSource,Data\n');
      results.forEach((result) => {
        if (result.pageTitle != result.titleSource) {
          newCsvStream.write(`${result.url},${result.pageTitle},${result.titleSource},${today}\n`);
          qtdErros++;
        }
      });
      newCsvStream.end();

      console.log(`Resultados salvos em ${newCsvFilePath}`);
      return {
        "newCsvFilePath" : newCsvFilePath,
        "qtdErros" : qtdErros
      };

}

exports.gravarCsv = gravarCsv;