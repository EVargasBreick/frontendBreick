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

const verifyQuantities = (selectedProducts) => {
  return new Promise((resolve, reject) => {
    const mappedArr = selectedProducts.map((item) => {
      // Perform mapping logic here
      if (item.cant_Actual == 0) {
        reject(
          `El producto ${item.nombreProducto} no tiene existencias disponibles`
        );
      }
      if (item.cantProducto == 0) {
        reject("Un producto esta en 0");
      }
      return item;
    });
    resolve(mappedArr);
  });
};

export { createSale, verifyQuantities };
