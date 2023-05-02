import axios from "axios";

const getGeneralSalesReport = (desde, hasta, sort, idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/ventas/general?idate=${desde}&fdate=${hasta}&sort=${sort}&idAgencia=${idAgencia}`
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

const getProductSalesReport = (desde, hasta, sort, idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/ventas/productos?idate=${desde}&fdate=${hasta}&sort=${sort}&idAgencia=${idAgencia}`
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

const getEndOfDayReport = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/cierre?idSucursal='${params.idSucursal}'&idPdv=${params.idPuntoDeVenta}&idAgencia='${params.idAgencia}'&ruta=${params.ruta}&fecha='${params.fecha}'`
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

const firstAndLastReport = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/cierre/detalles/facturas?idSucursal='${params.idSucursal}'&idPdv=${params.idPuntoDeVenta}&fecha='${params.fecha}'`
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

const mainPageReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/main`
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

const entryReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/log/ingreso`
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

export {
  getGeneralSalesReport,
  getProductSalesReport,
  getEndOfDayReport,
  firstAndLastReport,
  mainPageReport,
  entryReport,
};
