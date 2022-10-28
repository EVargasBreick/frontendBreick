import axios from "axios";
import config from "../config.json";

const createTransfer = (transferObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.endpointUrl}:${config.endpointPort}/traspaso`,
        transferObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const transferList = (accion) => {
  return new Promise((resolve) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/traspaso/lista?crit=${accion}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const transferProducts = (id) => {
  return new Promise((resolve) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/traspaso/productos?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const updateTransfer = (body) => {
  return new Promise((resolve) => {
    axios
      .put(
        `${config.endpointUrl}:${config.endpointPort}/traspaso/actualizar`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
};

export { createTransfer, transferList, transferProducts, updateTransfer };
