const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
async function scrapData(urls){

    let contador = 1;
    let $ = "";

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
          console.log(`[${contador++}/${urls.length}]: ${url}`);
          //Navegando até a URL
          await page.goto(url, { waitUntil: 'networkidle0' });            
          /*try {
            await page.goto(url, { waitUntil: 'networkidle0' });            
          } catch (error) {
            console.log(`Erro no puppeteer: `, error);
          }*/
          // Pegando o title renderizado pelo puppeteer
          const title = await page.title();

          try {
            const { data } = await axios.get(url);
            $ = cheerio.load(data);            
          } catch (err) {
            //Se der erro, a página retorna um html em err.response.data, então não há necessidade de colocar a URL na fila de novo
            $ = cheerio.load("Erro no axios: ", err.response.data); //console.error(err.response.data);    // *** //console.error(err.response.status);  // *** //console.error(err.response.headers); // ***            
          }

          // Tag Title no código fonte, coletado pelo Cheerio
          const titleSource = await $('title').text();
          // Salvando os dados em um objeto
          const result = { url, pageTitle: title, titleSource };
          // Salvando o objeto no array
          results.push(result);
          //console.log(`[${contador-1}/${urls.length}]: Dados coletados`);
        } catch (error) {
          //results.push({url, pageTitle: `erro`, titleSource: `erro`});
          console.error(`Erro ao acessar a URL ${url}: ${error}`);
          urls.push(url);
          console.log(`Url adicionada novamente à fila`)
        }
      }

      // Fechando o navegador
      await browser.close();
      
      return results;
}
exports.scrapData = scrapData;