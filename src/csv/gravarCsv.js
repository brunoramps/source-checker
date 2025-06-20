const fs = require('fs');
const moment = require('moment');
const path = require('path');

async function gravarCsv(cliente, results) {
  const today = moment().format('YYYY-MM-DD');
  let qtdErros = 0;

  const newCsvFilePath = path.join(__dirname, '../../resultados', `${cliente}.csv`);
  const fileExists = fs.existsSync(newCsvFilePath);

  // Abre o arquivo em modo de anexo ('a') se ele existir, caso contrário, cria um novo ('w')
  const newCsvStream = fs.createWriteStream(newCsvFilePath, { flags: 'a' });

  // Se o arquivo não existia antes, escreve o cabeçalho
  if (!fileExists) {
    newCsvStream.write('URL;pageTitle;titleSource;Data\n');
  }

  //if (result.pageTitle != result.titleSource) {
  results.forEach((result) => {
    newCsvStream.write(`${result.url};${result.pageTitle};${result.titleSource};${today}\n`);
    qtdErros++;
  });
  //}

  newCsvStream.end();

  console.log(`Resultados adicionados em ${newCsvFilePath}`);
  return {
    "newCsvFilePath": newCsvFilePath,
    "qtdErros": qtdErros
  };
}

async function gravarUmaUrlNoCsv(cliente, url) {
  const today = moment().format('YYYY-MM-DD');
  const csvFilePath = path.join(__dirname, '../../resultados', `${cliente}.csv`);
  const fileExists = fs.existsSync(csvFilePath);

  // Abre o arquivo no modo de anexo ('a')
  const csvStream = fs.createWriteStream(csvFilePath, { flags: 'a' });

  // Se o arquivo não existia, escreve o cabeçalho
  if (!fileExists) {
    csvStream.write('URL;pageTitle;titleSource;Data\n');
  }

  // Escreve a nova linha com a URL e a data
  csvStream.write(`${url.url};${url.pageTitle};${url.titleSource};${today}\n`);

  csvStream.end();

  console.log(`URL adicionada ao CSV: ${csvFilePath}`);
}

exports.gravarCsv = gravarCsv;
exports.gravarUmaUrlNoCsv = gravarUmaUrlNoCsv;