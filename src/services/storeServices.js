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

const getBranchesPs = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/sucursalesps`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getSalePoints = (idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/agencias/puntos?idAgencia=${idAgencia}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getMobileSalePoints = (idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/agencias/mobiles/puntos?idAgencia=${idAgencia}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getSalePointsAndStores = (idAgencia) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/agencias/puntos/nombres?idAlmacen=${idAgencia}`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

const getAllStores = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/agencias/todo`
      )
      .then((response) => {
        resolve(response);
      });
  });
};

export {
  getStores,
  getBranches,
  getOnlyStores,
  getSalePoints,
  getSalePointsAndStores,
  getBranchesPs,
  getMobileSalePoints,
  getAllStores,
};
