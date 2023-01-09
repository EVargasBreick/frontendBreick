import axios from "axios";
import config from "../config.json";
const getProducts = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/productos?id=${id}`)
      .then((response) => {
        resolve(response);
      });
  });
};

const getProductsWithStock = (idAlmacen, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/productos/stock?idAlmacen=${idAlmacen}&id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getUserStock = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/stockUsuario?id=${id}`)
      .then((response) => {
        resolve(response);
      });
  });
};
const numberOfProducts = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/productos/count`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const availableProducts = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/productos/disponible?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const productsDiscount = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/productos/descuentos?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

export {
  getProducts,
  getUserStock,
  numberOfProducts,
  availableProducts,
  getProductsWithStock,
  productsDiscount,
};
