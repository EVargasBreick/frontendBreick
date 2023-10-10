import axios from "axios";

const getSeasonalDiscount = (currentDate, tipo) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/descuentos/temporada?currentDate=${currentDate}&tipo=${tipo}`
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

const getCurrentSeason = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/descuentos/verificar?startDate=${startDate}&endDate=${endDate}`
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

const registerSeasonalDiscount = (body) => {
  const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/descuentos/registrar`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((err) => {
        console.log("Error al registrar", err);
      });
  });
};

const disableSeasonalDiscount = (id) => {
  const url = `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/descuentos/temporada/desactivar?id=${id}`;
  return new Promise((resolve, reject) => {
    axios
      .put(url)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((err) => {
        console.log("Error al registrar", err);
      });
  });
};

export {
  getSeasonalDiscount,
  getCurrentSeason,
  registerSeasonalDiscount,
  disableSeasonalDiscount,
};
