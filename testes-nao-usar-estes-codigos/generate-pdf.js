const fs = require('fs');
const puppeteer = require('puppeteer');
const moment = require('moment');
const { createTable } = require('table'); // Importando a biblioteca 'table'
const results = require('./results.json'); // Importando os resultados

(async () => {
  const today = moment().format('YYYY-MM-DD');
  const pdfPath = `${today}_results.pdf`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const tableData = [];

  for (const result of results) {
    await page.goto(result.url);
    const titleRendered = await page.title();
    const titleInSource = result.pageTitleInSource;
    const titleMatch = result.titlesMatch;

    tableData.push([result.url, titleRendered, titleInSource, titleMatch]);
  }

  // Configurando a tabela para impressão em PDF
  const tableConfig = {
    columns: {
      0: { alignment: 'left', width: 30 },
      1: { alignment: 'left', width: 30 },
      2: { alignment: 'left', width: 30 },
      3: { alignment: 'left', width: 30 }
    }
  };

  const table = createTable(tableData, tableConfig);

  const content = `
    <html>
      <body>
        <h1>Resultados da Verificação de Títulos</h1>
        ${table}
      </body>
    </html>
  `;

  await page.setContent(content);
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();
  console.log(`PDF gerado e salvo em ${pdfPath}`);
})();
