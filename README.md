# Source-Checker
 - Ferramenta que acessa os arquivos .csv contendo cada um deles uma lista de URLs a serem analisadas, coleta as informações do código renderizado pelo Chrome e compara com o código-fonte.
 - Com os dados coletados, analisa a porcentagem de erros encontrados e envia por e-mail para o analista do cliente o arquivo .csv contendo o resultado da análise e um título informando sobre os erros encontrados.

# 1. Configurar o e-mail de envio
- Primeiro, você deverá entrar nas configurações da sua conta de e-mail (no caso, usamos o gmail) e deverá pegar as credenciais de app e preencher seu e-mail e sua senha de app dentro do arquivo "transporter.js" que está na pasta mail.
- Aqui tem um tutorial: https://gestaopro.com.br/manual-sistema-gestaopro-post/como-habilitar-o-gmail-para-enviar-e-mail-por-aplicativos-externos

 # 2. Como definir o e-mail do analista
 - Como esta ferramenta foi desenvolvida para rodar em qualquer pc e não há conexão com banco de dados, você deverá configurar as informações dos analistas dentro da pasta "mail", no arquivo analista.js

 # 3. Como rodar a ferramenta
 - Instalação padrão com "npm start"
 - Coloque os arquivos .csv dentro da pasta "arquivos", cada um deles devem ter apenas uma coluna chamada "url" e cada URL deverá ser separada por quebra de linha (enter).
 - Abra o arquivo index.js que está dentro da pasta src e coloque o nome do arquivo dentro da função main, assim: main("nome-do-cliente-aqui").
 - Salve a alteração no arquivo e inicie a análise com "npm start".

 - Quando a análise terminar, cada cliente terá seu resultado salvo na pasta "resultados".