import axios from "axios";
import config from "../config.json";

const SoapLastId = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.endpointUrl}:${config.endpointPort}/xml/ultimoComprobante`,
        body
      )
      .then((response) => {
        resolve({
          response,
        });
      })
      .catch((error) => {
        reject(error);
        console.log("Error del back ", error);
      });
  });
};

export { SoapLastId };
