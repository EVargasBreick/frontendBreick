import axios from "axios";

const getLogStockProduct = (idProducto, fecha) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/log/stock/producto?idProducto=${idProducto}&fecha=${fecha}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getLogStockStore = (idAgencia, fecha) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/log/stock/agencia?idAgencia=${idAgencia}&fecha='${fecha}'`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCurrentStockStore = (idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/actual/stock/agencia?idAgencia=${idAgencia}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCurrentStockProduct = (idProducto) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/actual/stock/producto?idProducto=${idProducto}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateFullStock = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/full/update`,
        body
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const initializeStock = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/inicializar`,
        body
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const logProductEntry = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/log/ingreso`,
        body
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getStockCodes = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/codigos`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getStockLogged = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/logged?idAgencia=${body.idAgencia}&fromDate=${body.fromDate}&toDate=${body.toDate}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getProductsGroup = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/grupo/productos`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  getLogStockProduct,
  getLogStockStore,
  getCurrentStockProduct,
  getCurrentStockStore,
  updateFullStock,
  initializeStock,
  logProductEntry,
  getStockCodes,
  getStockLogged,
  getProductsGroup,
};
