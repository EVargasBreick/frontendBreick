import axios from "axios";

function registerDrop(body) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/baja`,
        body
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function searchDrop(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/baja/info?idBaja=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function cancelDrop(body) {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/baja/anular`,
        body
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function composedDrop(body) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/compuesto/baja`,
        body
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { registerDrop, searchDrop, cancelDrop, composedDrop };
