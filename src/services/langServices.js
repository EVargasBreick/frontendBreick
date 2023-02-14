import axios from "axios";

const getLanguajes = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/language`
      )
      .then((response) => {
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
