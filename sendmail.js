const fs = require('fs');
const puppeteer = require('puppeteer');
const csvParser = require('csv-parser');
const cheerio = require('cheerio');
const axios = require('axios');
const nodemailer = require('nodemailer');

async function main() {
  const urls = [];

  // Lendo o arquivo CSV e coletando as URLs
  fs.createReadStream('urls.csv')
    .pipe(csvParser())
    .on('data', (data) => {
      if (data.url) {
        urls.push(data.url);
      }
    })
    .on('end', async () => {
      // Inicializando o Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
        ]
      });
      const page = await browser.newPage();

      const results = [];

      // Acessando cada URL e coletando o título
      for (const url of urls) {
        try {
          console.log(`[...] - ${url}`);
          await page.goto(url, { waitUntil: 'networkidle0' });
          const title = await page.title();
          const pageContent = await page.content();

          const { data } = await axios.get(url);
    
          // Load HTML we fetched in the previous line
          const $ = cheerio.load(data);

          // Tag Title
          const titleSource = await $('title').text();
    
          const result = {
            url,
            pageTitle: title,
            titleSource,
            titlesMatch: title === titleSource ? 'Sim' : 'Não',
          };

          results.push(result);
          console.log(`[OK] - ${url}`);
        } catch (error) {
          console.error(`Erro ao acessar a URL ${url}: ${error}`);
        }
      }

      // Fechando o navegador
      await browser.close();

      // Escrevendo os resultados em um novo arquivo CSV
      const newCsvFilePath = 'results.csv';
      const newCsvStream = fs.createWriteStream(newCsvFilePath);
      newCsvStream.write('URL,pageTitle,titleSource,Iguais\n');
      results.forEach((result) => {
        newCsvStream.write(`${result.url},${result.pageTitle},${result.titleSource},${result.titlesMatch}\n`);
      });
      newCsvStream.end();

      console.log(`Resultados salvos em ${newCsvFilePath}`);

      // Enviando o arquivo CSV via e-mail
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Ex: 'gmail'
        auth: {
          user: 'bruno.ramos@webart.com.br',
          pass: 'dpsotytmlpzepluu'
        }
      });

      const mailOptions = {
        from: 'bruno.ramos@webart.com.br',
        to: 'seo@webart.com.br',
        subject: 'Resultados da Verificação de Títulos',
        text: 'Aqui estão os resultados da verificação de títulos.',
        attachments: [
          {
            filename: 'results.csv',
            path: newCsvFilePath
          }
        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail:', error);
        } else {
          console.log('E-mail enviado:', info.response);
        }
      });
    });
}

main();
