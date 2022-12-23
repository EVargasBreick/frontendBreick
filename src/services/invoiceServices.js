import axios from "axios";
import config from "../config.json";

const createInvoice = (invoiceObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.endpointUrl}:${config.endpointPort}/factura`,
        invoiceObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteInvoice = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.endpointUrl}:${config.endpointPort}/factura?id=${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { createInvoice, deleteInvoice };
