import axios from "axios";

const SoapLastId = (body) => {
  console.log(
    "Punto de venta id",
    (body.puntoDeVentaId * 10000 + parseInt(body.caja)).toFixed(0)
  );
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/xml/ultimoComprobante`,
        body
      )
      .then((response) => {
        resolve({
          response,
        });
      })
      .catch((error) => {
        reject(error);
        console.log("Error del back ", error);
      });
  });
};

export { SoapLastId };
