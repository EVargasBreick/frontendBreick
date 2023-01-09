import axios from "axios";
import config from "../config.json";

const getRoles = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/roles`)
      .then((response) => {
        console.log("Respuesta", response.status);
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      });
  });
};
export { getRoles };
