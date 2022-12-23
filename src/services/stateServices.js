import axios from "axios";
import config from "../config.json";

const getDepartamentos = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/departamentos`)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      });
  });
};

export { getDepartamentos };
