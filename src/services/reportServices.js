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
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/cierre?idSucursal='${params.idSucursal}'&idPdv=${params.idPuntoDeVenta}&idAgencia='${params.idAgencia}'&ruta=${params.ruta}&fecha=${params.fecha}&fromHour=${params.fromHour}&toHour=${params.toHour}`
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
  async getProductOrderReport(idAgencia, startDate, endDate) {
    const url = `/reportes/productos/pedidos`;
    const params = {
      idAgencia,
      startDate,
      endDate,
    };
    const response = await reportInstance.get(url, { params });
    return response.data;
  },
  async getGroupedProductReport(
    agencias,
    startDate,
    endDate,
    selectedClient,
    selectedSalesman,
    criteria
  ) {
    const url = `/reportes/agrupado/productos`;
    const params = {
      idAgencia: agencias,
      startDate,
      endDate,
      selectedClient,
      selectedSalesman,
      criteria,
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

const salesBySellerReport = (startDate, endDate, startHour, endHour) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/totales/vendedor?startDate=${startDate}&endDate=${endDate}&startHour=${startHour}&endHour=${endHour}`
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

const sellerProductReport = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/agrupado/productos/vendedor?startDate='${startDate}'&endDate='${endDate}'`
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

const virtualStockReport = (nitCliente, idZona) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/stock/virtual?nitCliente='${nitCliente}'&idZona=${idZona}`
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

const getSalesByStoreReport = (startDate, endDate) => {
  const url = `/reportes/traspasos/agencia?startDate='${startDate}'&endDate='${endDate}'`;
  const base = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}`;
  const response = axios.get(base + url);
  return response;
};

const salesByDayReport = (month, year) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/diario/vendedor?year=${year}&month=${month}`
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

const monthlyGoalsReport = (month, year) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/diario/metas?year=${year}&month=${month}`
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

const remainingDayGoal = (idUsuario, fecha) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/diario/restante?idUsuario=${idUsuario}&fecha=${fecha}`
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

const samplesReport = (startDate, endDate, idAgencia, tipo) => {
  console.log("PARAMS EN EL FRONT", startDate, endDate, idAgencia);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/muestras?startDate=${startDate}&endDate=${endDate}&idAgencia=${idAgencia}&tipo=${tipo}`
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

const samplesProductReport = (startDate, endDate, idAgencia, orderType) => {
  console.log("PARAMS EN EL FRONT", startDate, endDate, idAgencia);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/muestras/productos?startDate=${startDate}&endDate=${endDate}&idAgencia=${idAgencia}&tipo=${orderType}`
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

const transferProductReport = (startDate, endDate, idAgencia) => {
  console.log("PARAMS EN EL FRONT", startDate, endDate, idAgencia);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/traspasos/productos?startDate=${startDate}&endDate=${endDate}&idAgencia=${idAgencia}`
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

const simpleTransferReport = (startDate, endDate, idAgencia) => {
  console.log("PARAMS EN EL FRONT", startDate, endDate, idAgencia);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/traspasos/simple?startDate=${startDate}&endDate=${endDate}&idAgencia=${idAgencia}`
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

const dailyDiscountReport = (date) => {
  console.log("PARAMS EN EL FRONT", date);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/descuentos/diario?date=${date}`
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

const canceledInvoicesReport = ({ fromDate, toDate, idAgencia }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/facturas/canceladas?fromDate=${fromDate}&toDate=${toDate}&idAgencia=${idAgencia}`
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

const pastSalesReport = ({ fromDate, toDate }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/ventas/pasadas/producto?fromDate=${fromDate}&toDate=${toDate}`
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

const saleDetails = (idFactura) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/reportes/ventas/detalle?idFactura=${idFactura}`
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
  virtualStockReport,
  sellerProductReport,
  getSalesByStoreReport,
  salesByDayReport,
  monthlyGoalsReport,
  remainingDayGoal,
  samplesReport,
  samplesProductReport,
  transferProductReport,
  simpleTransferReport,
  dailyDiscountReport,
  canceledInvoicesReport,
  pastSalesReport,
  saleDetails,
};
