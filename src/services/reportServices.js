import axios from "axios";
import config from "../config.json";

const getGeneralSalesReport = (desde, hasta, sort) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/reportes/ventas/general?idate=${desde}&fdate=${hasta}&sort=${sort}`
      )
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

const getProductSalesReport = (desde, hasta, sort) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/reportes/ventas/productos?idate=${desde}&fdate=${hasta}&sort=${sort}`
      )
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
export { getGeneralSalesReport, getProductSalesReport };
