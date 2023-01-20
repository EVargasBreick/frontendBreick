import axios from "axios";
import config from "../config.json";

const getLogStockProduct = (idProducto, fecha) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/log/stock/producto?idProducto=${idProducto}&fecha=${fecha}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getLogStockStore = (idAgencia, fecha) => {
  console.log("Datos ingresados", idAgencia, fecha);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/log/stock/agencia?idAgencia=${idAgencia}&fecha='${fecha}'`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCurrentStockStore = (idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/actual/stock/agencia?idAgencia=${idAgencia}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCurrentStockProduct = (idProducto) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/actual/stock/producto?idProducto=${idProducto}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateFullStock = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${config.endpointUrl}:${config.endpointPort}/stock/full/update`,
        body
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  getLogStockProduct,
  getLogStockStore,
  getCurrentStockProduct,
  getCurrentStockStore,
  updateFullStock,
};
