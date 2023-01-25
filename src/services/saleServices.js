import axios from "axios";

const createSale = (saleObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/venta`,
        saleObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const verifyQuantities = (selectedProducts) => {
  return new Promise((resolve, reject) => {
    const mappedArr = selectedProducts.map((item) => {
      // Perform mapping logic here
      if (item.cant_Actual == 0) {
        reject(
          `El producto ${item.nombreProducto} no tiene existencias disponibles`
        );
      }
      if (item.cantProducto == 0) {
        reject("Un producto esta en 0");
      }
      return item;
    });
    resolve(mappedArr);
  });
};

export { createSale, verifyQuantities };
