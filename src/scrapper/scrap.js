const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const { gravarUmaUrlNoCsv } = require('../csv/gravarCsv');
async function scrapData(urls) {

  let contador = 1;
  let $ = "";

  // Inicializando o Puppeteer
  const browser = await puppeteer.launch({
    //headless: 'shell',
    headless: false,
    args: [
      '--no-sandbox',
    ]
  });

  const results = [];

  // Função utilitária para aguardar um tempo (em milissegundos)
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Acessando cada URL e coletando o título
  for (const url of urls) {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
    try {
      console.log(`[${contador++}/${urls.length}]: ${url}...`);
      //Navegando até a URL
      await page.goto(url, { waitUntil: 'networkidle2' });
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
      console.log(`[OK]: [${title}]`);
      await gravarUmaUrlNoCsv('dss', result);
    } catch (error) {
      //results.push({url, pageTitle: `erro`, titleSource: `erro`});
      console.error(`Erro ao acessar a URL ${url}: ${error}`);
      urls.push(url);
      console.log(`Url adicionada novamente à fila`)
    }
    page.close();

    // Espera 30 segundos antes da próxima iteração
    await sleep(2000);
  }

  // Fechando o navegador
  await browser.close();

  return results;
}
exports.scrapData = scrapData;