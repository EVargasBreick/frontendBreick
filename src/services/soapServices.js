import axios from "axios";
import xml2js from "xml2js";

function comfiarLogin(userName, password) {
  const wsdlLink = ``;
  const requestBody = `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body>
    <IniciarSesion xmlns="http://test.comfiar.com.bo/">
    <usuarioId>${userName}</usuarioId>
    <password>${password}</password>
    </IniciarSesion>
    </soap:Body>
    </soap:Envelope>`;
}
function convertWsdlToJson(wsdl) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(wsdl, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export { comfiarLogin };
