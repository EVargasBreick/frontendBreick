import axios from "axios";
import config from "../config.json";

const getLanguajes = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/language`)
      .then((response) => {
        console.log("Lenguajes encontrados", response.status);
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      });
  });
};

const getLanguajeById = (id, lenguajes) => {
  let leng = lenguajes.find((l) => l.idLenguaje === id);
  return new Promise((resolve, reject) => {
    resolve(leng);
  });
};

export { getLanguajes, getLanguajeById };
