import axios from "axios";

const productsInstance = axios.create({
  baseURL: `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos`,
});

const getProducts = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const allProducts = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/all`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getProductsWithStock = (idAlmacen, id) => {
  console.log("ID ALMACEN ACA", idAlmacen);
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/stock?idAlmacen=${idAlmacen}&id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getProductsConsignacion = async (nit, idZona) => {
  console.log("getProductsConsignacion", nit, idZona);
  const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/stock/virtual`;
  const response = await axios.get(url, {
    params: {
      nitCliente: nit,
      idZona: idZona,
    },
  });
  return response;
};

const getUserStock = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stockUsuario?id=${id}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};
const numberOfProducts = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/count`
      )
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
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/disponible?id=${id}`
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
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/descuentos?id=${id}`
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

const updateForMissingSample = (selectedProds, faltantes) => {
  var modifiedProds = [];
  selectedProds.map((prod) => {
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
        precioDescuentoFijo: 0,
        totalProd: 0,
        totalDescFijo: 0,
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
        totalProd: 0,
        totalDescFijo: 0,
        tipoProducto: prod.tipoProducto,
        descuentoProd: 0,
        unidadDeMedida: prod.unidadDeMedida,
      };
    }
    if (!isZero) {
      modifiedProds.push(auxObj);
    }
  });
  return Promise.resolve({
    modificados: modifiedProds,
  });
};

const setTotalProductsToZero = (selectedProds) => {
  const modifiedArray = [];
  selectedProds.map((prod) => {
    const auxObj = {
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
      totalProd: prod.totalProd,
      totalDescFijo: 0,
      tipoProducto: prod.tipoProducto,
      descuentoProd: 0,
      unidadDeMedida: prod.unidadDeMedida,
    };
    modifiedArray.push(auxObj);
  });
  return Promise.resolve({
    modificados: modifiedArray,
  });
};

const logShortage = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/faltantes`,
        body
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const newProduct = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/nuevo`,
        body
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getCodes = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/codigos`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const productTypes = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/tipos`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const productOrigin = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/origen`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const productsService = {
  async getAllProducts() {
    const response = await productsInstance.get("/all");
    return response.data;
  },
  async updateProduct(id, body) {
    const response = await productsInstance.put(`/editar/${id}`, body);
    return response.data;
  },
};

const virtualProductStock = (idZona, nitCliente) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/productos/stock/virtual?idZona=${idZona}&nitCliente=${nitCliente}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
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
  newProduct,
  getCodes,
  productTypes,
  productOrigin,
  updateForMissingSample,
  setTotalProductsToZero,
  virtualProductStock,
  getProductsConsignacion,
  allProducts,
};
