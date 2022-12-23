import axios from "axios";
import config from "../config.json";

const createSale = (saleObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.endpointUrl}:${config.endpointPort}/venta`, saleObject)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { createSale };
