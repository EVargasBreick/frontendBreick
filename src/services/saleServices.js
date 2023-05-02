import axios from "axios";
import { debounce } from "lodash";

const debouncedCreateSale = debounce(
  async (saleObject) => {
    const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/venta`;
    const response = await axios.post(url, saleObject);
    if (response.status === 200) {
      return { data: response.data };
    } else {
      resetDebouncedInvoice();
      throw new Error(`Invalid response status code: ${response.status}`);
    }
  },
  45000,
  { leading: true }
);

const resetDebouncedInvoice = () => {
  debouncedCreateSale.cancel();
};

const createSale = (saleObject) => {
  return debouncedCreateSale(saleObject);
};

const deleteSale = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/venta?id=${id}`
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
      if (item.cant_Actual == 0) {
        reject(
          `El producto ${item.nombreProducto} no tiene existencias disponibles`
        );
      }
      if (item.cantProducto == 0) {
        reject("Un producto esta en 0");
      }
      if (item.cantProducto > item.cant_Actual) {
        reject(
          `El producto ${item.nombreProducto} no tiene suficientes existencias disponibles`
        );
      }
      return item;
    });
    resolve(mappedArr);
  });
};

export { createSale, verifyQuantities, deleteSale };
