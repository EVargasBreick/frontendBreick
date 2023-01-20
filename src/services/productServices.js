import axios from "axios";
import config from "../config.json";
const getProducts = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/productos?id=${id}`)
      .then((response) => {
        resolve(response);
      });
  });
};

const getProductsWithStock = (idAlmacen, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/productos/stock?idAlmacen=${idAlmacen}&id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getUserStock = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/stockUsuario?id=${id}`)
      .then((response) => {
        resolve(response);
      });
  });
};
const numberOfProducts = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/productos/count`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const availableProducts = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/productos/disponible?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const productsDiscount = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.endpointUrl}:${config.endpointPort}/productos/descuentos?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const updateForMissing = (selectedProds, faltantes) => {
  var modifiedProds = [];
  var tradicionales = [];
  var pascua = [];
  var navidad = [];
  var halloween = [];
  var sinDesc = [];
  var especiales = [];
  selectedProds.map((prod) => {
    console.log("Producto que llego hasta aca", prod);
    const foundProd = faltantes.find((ft) => ft.idProducto == prod.idProducto);
    let auxObj;

    var isZero = false;
    if (foundProd != undefined) {
      const cantDisp =
        foundProd.cantProducto - foundProd.faltante + prod.cantPrevia;
      if (cantDisp < 1) {
        isZero = true;
      }
      auxObj = {
        cant_Actual: prod.cant_Actual,
        cantPrevia: prod.cantPrevia,
        cantProducto: cantDisp,
        codInterno: prod.codInterno,
        codigoBarras: prod.codigoBarras,
        idProducto: prod.idProducto,
        idPedidoProducto: prod.idPedidoProducto,
        nombreProducto: prod.nombreProducto,
        precioDeFabrica: prod.precioDeFabrica,
        precioDescuentoFijo: prod.precioDescuentoFijo,
        totalProd: cantDisp * prod.precioDeFabrica,
        totalDescFijo: cantDisp * prod.precioDescuentoFijo,
        tipoProducto: prod.tipoProducto,
        descuentoProd: 0,
        unidadDeMedida: prod.unidadDeMedida,
      };
    } else {
      auxObj = {
        cant_Actual: prod.cant_Actual,
        cantPrevia: prod.cantPrevia,
        cantProducto: prod.cantProducto,
        codInterno: prod.codInterno,
        codigoBarras: prod.codigoBarras,
        idProducto: prod.idProducto,
        idPedidoProducto: prod.idPedidoProducto,
        nombreProducto: prod.nombreProducto,
        precioDeFabrica: prod.precioDeFabrica,
        precioDescuentoFijo: prod.precioDescuentoFijo,
        totalProd: prod.cantProducto * prod.precioDeFabrica,
        totalDescFijo: prod.cantProducto * prod.precioDescuentoFijo,
        tipoProducto: prod.tipoProducto,
        descuentoProd: 0,
        unidadDeMedida: prod.unidadDeMedida,
      };
    }
    if (!isZero) {
      prod.tipoProducto == 1
        ? tradicionales.push(auxObj)
        : prod.tipoProducto == 2
        ? pascua.push(auxObj)
        : prod.tipoProducto == 3
        ? navidad.push(auxObj)
        : prod.tipoProducto == 4
        ? halloween.push(auxObj)
        : prod.tipoProducto == 5
        ? sinDesc.push(auxObj)
        : especiales.push(auxObj);
      modifiedProds.push(auxObj);
    }
  });
  return Promise.resolve({
    modificados: modifiedProds,
    trads: tradicionales,
    pas: pascua,
    nav: navidad,
    hall: halloween,
    sd: sinDesc,
    esp: especiales,
  });
};

const logShortage = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.endpointUrl}:${config.endpointPort}/faltantes`, body)
      .then((response) => {
        resolve(response);
      });
  });
};

export {
  getProducts,
  getUserStock,
  numberOfProducts,
  availableProducts,
  getProductsWithStock,
  productsDiscount,
  updateForMissing,
  logShortage,
};
