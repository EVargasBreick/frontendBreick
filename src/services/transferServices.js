import axios from "axios";

const createTransfer = (transferObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso`,
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
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/lista?crit=${accion}`
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
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/productos?id=${id}`
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
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/actualizar`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const printedTrasnfer = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/imprimir?id=${id}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function updateChangedTransfer(body) {
  return new Promise((resolve) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
}

function addProductToTransfer(body) {
  return new Promise((resolve) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/productos`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
}

function deleteProductFromTransfer(body) {
  return new Promise((resolve) => {
    axios
      .delete(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/productos`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
}

function updateProductTransfer(body) {
  return new Promise((resolve) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/productos`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
}

export {
  createTransfer,
  transferList,
  transferProducts,
  updateTransfer,
  printedTrasnfer,
  updateChangedTransfer,
  addProductToTransfer,
  deleteProductFromTransfer,
  updateProductTransfer,
};
