import axios from "axios";
import config from "../config.json";
const getZonas = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/zonas`)
      .then((response) => {
        resolve(response);
      });
  });
};
const getDias = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.endpointUrl}:${config.endpointPort}/dias`)
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
