const fs = require('fs');
const puppeteer = require('puppeteer');
const csvParser = require('csv-parser');

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
          console.log(`${url}...`);
          await page.goto(url, {"waitUntil": "networkidle0"});
          const title = await page.title();
          const pageContent = await page.content();
          
          // Coletando o título da página do código-fonte
          const pageTitleInSource = pageContent.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
          
          const result = {
            url,
            pageTitle: title,
            pageTitleInSource,
            titlesMatch: title === pageTitleInSource ? 'Sim' : 'Não',
          };
          
          results.push(result);
          console.log(`${url}!`);
        } catch (error) {
          console.error(`Erro ao acessar a URL ${url}: ${error}`);
        }
      }

      // Fechando o navegador
      await browser.close();

      // Escrevendo os resultados no mesmo arquivo CSV
      const csvStream = fs.createWriteStream('urls.csv', { flags: 'a' }); // 'a' para adicionar ao final
      csvStream.write('url,pageTitle,pageTitleInSource,titlesMatch\n');
      results.forEach((result) => {
        csvStream.write(`${result.url},${result.pageTitle},${result.pageTitleInSource},${result.titlesMatch}\n`);
      });
      csvStream.end();
    });
}

main();
