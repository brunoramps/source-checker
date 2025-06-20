async function getEmailAnalista(cliente) {

  let analistas = {
    bruno: {
      "email": "bruno.ramos@blan.digital"
    },
    hugo: {
      "email": "hugo.iwaasa@webart.com.br"
    },
    yasmim: {
      "email": "yasmim.novais@webart.com.br"
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
      break;
    case "vivabeauty":
      emailAnalista = analistas.hugo.email
      break;
    case "viaaroma":
      emailAnalista = analistas.bruno.email
      break;
    case "bianco":
      emailAnalista = analistas.yasmim.email
      break;
    case "casa":
      emailAnalista = analistas.yasmim.email
      break;
    case "mori":
      emailAnalista = analistas.yasmim.email
      break;
    case "mith":
      emailAnalista = analistas.yasmim.email
    case "dss":
      emailAnalista = analistas.bruno.email
      break;
    default:
      break;
  }

  return emailAnalista;
}

exports.getEmailAnalista = getEmailAnalista;