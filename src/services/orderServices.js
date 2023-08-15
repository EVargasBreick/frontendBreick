import axios from "axios";
import debounce from "lodash/debounce";
const createOrder = (orderObject) => {
  console.log("CREANDO PEDIDO", orderObject);
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos`,
        orderObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderStatus = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/estado`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderList = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/lista?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAllOrderList = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/lista/todos?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getUserOrderList = (id, condition) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/lista/usuario?id=${id}&condition=${condition}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderDetail = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/detalle?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderType = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/tipo`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const sendOrderEmail = (emailBody) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/correo`,
        emailBody
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const approveOrderFromId = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/aprobar?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOrderProdList = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/productos?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const availabilityInterval = () => {
  const randnumb = randomIntFromInterval(1000, 2000);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randnumb);
    }, 5000);
  });
};

const updateStock = debounce(
  async (updateObj) => {
    return new Promise(async (resolve, reject) => {
      const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/update`;
      const response = await axios.put(url, updateObj);
      console.log("Response de update stock", response);
      if (response.data.code === 200) {
        resolve(response);
      } else {
        const errorMessage = response.data.error.includes("stock_nonnegative")
          ? "Una de las cantidades solicitadas ya no se encuentra disponible, recargue e intente nuevamente"
          : "Error desconocido al actualizar stocks";
        reject(errorMessage);
      }
    });
  },
  3000,
  { leading: true }
);

const updateMultipleStock = debounce(
  async (updateObj) => {
    return new Promise(async (resolve, reject) => {
      const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/updatetransaction`;
      try {
        const response = await axios.put(url, updateObj);
        console.log(
          "respuesta de la actualizacion compuesta de stocks",
          response
        );
        if (response.data.code === 200) {
          resolve(response);
        } else {
          const errorMessage = response.data.error.includes("stock_nonnegative")
            ? "Una de las cantidades solicitadas ya no se encuentra disponible, recargue e intente nuevamente"
            : "Error desconocido al actualizar stocks";
          reject(errorMessage);
        }
      } catch (err) {
        console.log("respuesta de la actualizacion compuesta de stocks", err);
        reject(err);
      }
    });
  },
  3000,
  { leading: true }
);

const deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos?id=${id}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const cancelOrder = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/cancelar?id=${id}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const addProductToOrder = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/productos/agregar`,
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

const updateOrderProduct = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/productos/actualizar`,
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

const updateDbOrder = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/actualizar`,
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

const deleteProductOrder = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/productos/borrar`,
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

const orderToInvoiceList = (idDepto) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/lista/facturar?idDepto=${idDepto}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const orderDetailsInvoice = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/detalles/facturar?id=${id}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateInvoicedOrder = (id, fecha) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/actualizar/facturar?idPedido=${id}&fechaHora=${fecha}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const ordersToPrint = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/imprimir`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const printedOrder = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/imprimir?id=${id}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const ordersToReady = (idDepto, interior) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/alistar?idDepto=${idDepto}&interior=${interior}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateReady = (id, listo, tipo, interior) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/${tipo}/alistar?id=${id}&listo=${listo}&interior=${interior}`
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateVirtualStock = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/virtual/actualizar`,
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

const updateMultipleVirtualStock = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/stock/virtual/actualizar/multiple`,
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

export {
  createOrder,
  getOrderStatus,
  getOrderList,
  getOrderDetail,
  getOrderType,
  sendOrderEmail,
  approveOrderFromId,
  getOrderProdList,
  availabilityInterval,
  updateStock,
  deleteOrder,
  cancelOrder,
  addProductToOrder,
  updateOrderProduct,
  updateDbOrder,
  deleteProductOrder,
  getUserOrderList,
  orderToInvoiceList,
  orderDetailsInvoice,
  updateInvoicedOrder,
  ordersToPrint,
  printedOrder,
  ordersToReady,
  updateReady,
  getAllOrderList,
  updateMultipleStock,
  updateVirtualStock,
  updateMultipleVirtualStock,
};
