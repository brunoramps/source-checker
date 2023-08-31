const fs = require('fs');
const puppeteer = require('puppeteer');
const csvParser = require('csv-parser');
const cheerio = require('cheerio');
const axios = require('axios');
const nodemailer = require('nodemailer');
const moment = require('moment');

async function main(cliente) {
  const urls = [];
  const today = moment().format('YYYY-MM-DD');
  let qtdErros = 0;
  let contador = 1;
  let $ = "";

  // Lendo o arquivo CSV e coletando as URLs
  fs.createReadStream(`arquivos/${cliente}.csv`)
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
          console.log(`${url}`);
          console.log(`[Analisando ${contador++}/${urls.length}...]`);
          await page.goto(url, { waitUntil: 'networkidle0' });
          const title = await page.title();

          try {
            const { data } = await axios.get(url);
            $ = cheerio.load(data);
            
          } catch (err) {
            console.error("Error response:");
            $ = cheerio.load(err.response.data);
            //console.error(err.response.data);    // ***
            //console.error(err.response.status);  // ***
            //console.error(err.response.headers); // ***
            
          }
    
          // Load HTML we fetched in the previous line

          // Tag Title
          const titleSource = await $('title').text();
    
          const result = {
            url,
            pageTitle: title,
            titleSource,
            titlesIguais: titlesMatch(title, titleSource)
          };

          function titlesMatch(pageTitle, sourceTitle){
            if(pageTitle === sourceTitle){
              return "Sim"
            }else{
              qtdErros++;
              return "Não"
            }

          }

          results.push(result);
          console.log(`[OK]`);
        } catch (error) {
          console.error(`Erro ao acessar a URL ${url}: ${error}`);
        }
      }

      // Fechando o navegador
      await browser.close();

      // Escrevendo os resultados em um novo arquivo CSV
      const newCsvFilePath = `resultados/${cliente}.csv`;
      const newCsvStream = fs.createWriteStream(newCsvFilePath);
      newCsvStream.write('URL,pageTitle,titleSource,titlesIguais,Data\n');
      results.forEach((result) => {
        newCsvStream.write(`${result.url},${result.pageTitle},${result.titleSource},${result.titlesIguais},${today}\n`);
      });
      newCsvStream.end();

      console.log(`Resultados salvos em ${newCsvFilePath}`);

      // Enviando o arquivo CSV via e-mail
      const transporter = nodemailer.createTransport({
        //service: 'gmail', // Ex: 'gmail'
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'bruno.ramos@webart.com.br',
          pass: 'dpsotytmlpzepluu'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let analistas = {
        bruno : {
          "email" : "bruno.ramos@webart.com.br"
        },
        hugo : {
          email : "hugo.iwaasa@webart.com.br"
        }
      }

      let emailAnalista = "";
      switch (cliente) {
        case "desincha":
          emailAnalista = analistas.bruno.email
          break;
        case "daikin":
          emailAnalista = analistas.hugo.email
          break;
        case "matisse":
          emailAnalista = analistas.hugo.email
          break;
        case "100peso":
          emailAnalista = analistas.hugo.email
          break;
        case "newwhite":
          emailAnalista = analistas.hugo.email
          break;
        case "uplips":
          emailAnalista = analistas.hugo.email
        case "vivabeauty":
          emailAnalista = analistas.hugo.email
          break;
        case "viaaroma":
          emailAnalista = analistas.bruno.email 
        default:
          break;
      }
      console.log("Email enviado para o analista: ", emailAnalista);
      const mailOptions = {
        from: 'bruno.ramos@webart.com.br',
        to: 'seo@webart.com.br',
        cc: [
          `${emailAnalista}`
        ],
        subject: `${qtdErros} erros encontrados na Verificação de Código-Fonte de ${cliente}`,
        text: `Segue em anexo o arquivo .csv gerado pelo sistema com os dados da verificação`,
        attachments: [
          {
            filename: `${cliente}.csv`,
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

//main();

exports.main = main;