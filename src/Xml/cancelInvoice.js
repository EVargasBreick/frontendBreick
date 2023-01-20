import axios from "axios";
import config from "../config.json";

const CancelInvoice = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.endpointUrl}:${config.endpointPort}/xml/cancelarComprobante`,
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

export { CancelInvoice };
