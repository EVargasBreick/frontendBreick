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

const reportInstance = axios.create({
  baseURL: `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}`,
});

export const reportService = {
  async getMarkdownsReport(
    idAgencia,
    startDate = null,
    endDate = null,
    idBaja = null
  ) {
    const url = `/reportes/bajas/general`;
    const params = {
      idAgencia,
      startDate,
      endDate,
      idBaja,
    };
    const response = await reportInstance.get(url, { params });
    return response.data;
  },
  async getProductOrderReport(
    idAgencia,
    startDate = null,
    endDate = null,
    estado = null,
    usuario = null,
    tipo = null,
    facturado = null,
    notas = null
  ) {
    const url = `/reportes/productos/pedidos`;
    const params = {
      idAgencia,
      startDate,
      endDate,
      estado,
      usuario,
      tipo,
      facturado,
      notas,
    };
    const response = await reportInstance.get(url, { params });
    return response.data;
  },
};

const salesByStoreReport = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/totales/agencia?startDate='${startDate}'&endDate='${endDate}'`
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

const salesBySellerReport = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/totales/vendedor?startDate='${startDate}'&endDate='${endDate}'`
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
  salesByStoreReport,
  salesBySellerReport,
};
