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
const getUserStock = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/stockUsuario?id=${id}`)
      .then((response) => {
        resolve(response);
      });
  });
};
export { getProducts, getUserStock };
