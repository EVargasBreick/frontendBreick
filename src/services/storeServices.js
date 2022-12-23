import axios from "axios";
import config from "../config.json";
const getStores = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/agencias`)
      .then((response) => {
        resolve(response);
      });
  });
};

const getBranches = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/sucursales`)
      .then((response) => {
        resolve(response);
      });
  });
};

export { getStores, getBranches };
