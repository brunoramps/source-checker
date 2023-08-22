const fs = require('fs');
const puppeteer = require('puppeteer');
const csvParser = require('csv-parser');
const cheerio = require('cheerio');
const axios =   require('axios');

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
          const titleSource   = await $('title').text();
    

          // Coletando o título da página do código-fonte
          //const pageTitleInSource = pageContent.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';

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
      const newCsvStream = fs.createWriteStream('results.csv'); // Criando um novo arquivo CSV
      newCsvStream.write('URL,pageTitle,titleSource,Iguais\n');
      results.forEach((result) => {
        newCsvStream.write(`${result.url},${result.pageTitle},${result.titleSource},${result.titlesMatch}\n`);
      });
      newCsvStream.end();
    });
}

main();
