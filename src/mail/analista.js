async function getEmailAnalista(cliente){
    
    let analistas = {
        bruno : {
          "email" : "bruno.ramos@webart.com.br"
        },
        hugo : {
          "email" : "hugo.iwaasa@webart.com.br"
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

      return emailAnalista;
}

exports.getEmailAnalista = getEmailAnalista;