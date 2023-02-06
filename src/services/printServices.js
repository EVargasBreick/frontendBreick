import axios from "axios";

const rePrintTransferOrder = (id, type) => {
  if (type == "P") {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pedidos/reimprimir?id=${id}`
        )
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/traspaso/reimprimir?id=${id}`
        )
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

export { rePrintTransferOrder };
