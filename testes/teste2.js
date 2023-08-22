const fs = require('fs');
const puppeteer = require('puppeteer');
const csvParser = require('csv-parser');
const papa = require('papaparse');
const moment = require('moment');

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
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();

      const results = [];

      // Acessando cada URL e coletando o título
      for (const url of urls) {
        try {
          await page.goto(url, { waitUntil: 'networkidle0' });
          const title = await page.title();
          const pageContent = await page.content();

          // Coletando o título da página do código-fonte
          const pageTitleInSource = pageContent.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';

          const result = {
            url,
            pageTitle: title,
            pageTitleInSource,
            titlesMatch: title === pageTitleInSource ? 'Sim' : 'Não'
          };

          results.push(result);
        } catch (error) {
          console.error(`Erro ao acessar a URL ${url}: ${error}`);
        }
      }

      // Fechando o navegador
      await browser.close();

      // Lendo o arquivo CSV original
      const csvData = fs.readFileSync('urls.csv', 'utf8');

      // Convertendo o CSV para objetos
      const parsedData = papa.parse(csvData, { header: true, skipEmptyLines: true });

      // Atualizando os resultados nos objetos
      for (const [index, row] of parsedData.data.entries()) {
        const result = results[index] || {};
        row.pageTitle = result.pageTitle || '';
        row.pageTitleInSource = result.pageTitleInSource || '';
        row.titlesMatch = result.titlesMatch || '';
      }

      // Convertendo os objetos de volta para CSV
      const updatedCsv = papa.unparse(parsedData);

      // Escrevendo os resultados no mesmo arquivo CSV
      fs.writeFileSync('urls.csv', updatedCsv);

      console.log('Resultados atualizados no arquivo CSV.');
    });
}

main();
