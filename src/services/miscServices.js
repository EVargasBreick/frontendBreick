import axios from "axios";

const getZonas = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/zonas`
      )
      .then((response) => {
        resolve(response);
      });
  });
};
const getDias = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/dias`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getZoneById = (id, zonas) => {
  zonas.map((zona) => {
    if (zona.idZona === id) {
      return zona.zona;
    }
  });
};

const getDayById = (id, dias) => {
  dias.map((dia) => {
    if (dia.idDiasFrec === id) {
      return dia.dias;
    }
  });
};

export { getZonas, getDias, getZoneById, getDayById };
