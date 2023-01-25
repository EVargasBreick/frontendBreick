import axios from "axios";

const getStores = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/agencias`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getOnlyStores = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/agencias/solo`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getBranches = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/sucursales`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

export { getStores, getBranches, getOnlyStores };
