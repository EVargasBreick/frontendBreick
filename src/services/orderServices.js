import axios from "axios";
import config from "../config.json";

const createOrder = (orderObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.endpointUrl}:${config.endpointPort}/pedidos`, orderObject)
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
      .get(`${config.endpointUrl}:${config.endpointPort}/pedidos/estado`)
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/lista?id=${id}`
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/detalle?id=${id}`
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
      .get(`${config.endpointUrl}:${config.endpointPort}/pedidos/tipo`)
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
      .post(`${config.endpointUrl}:${config.endpointPort}/correo`, emailBody)
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/aprobar?id=${id}`
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/productos?id=${id}`
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

const updateStock = (updateObj) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${config.endpointUrl}:${config.endpointPort}/stock/update`,
        updateObj
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.endpointUrl}:${config.endpointPort}/pedidos?id=${id}`)
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/cancelar?id=${id}`
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/productos/agregar`,
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/productos/actualizar`,
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
        `${config.endpointUrl}:${config.endpointPort}/pedidos/actualizar`,
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
  console.log("Enviando body de remover productos", body);
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${config.endpointUrl}:${config.endpointPort}/pedidos/productos/borrar`,
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
};
