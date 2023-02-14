import axios from "axios";

import { dateString } from "./dateServices";

const controlUserInput = (
  nombre,
  apPaterno,
  apMaterno,
  correo,
  usuario,
  password,
  vpassword,
  ci,
  acceso,
  idioma,
  categoria,
  agencia
) => {
  return new Promise((resolve, reject) => {
    if (
      !nombre ||
      !correo ||
      !apPaterno ||
      !apMaterno ||
      !usuario ||
      !password ||
      !vpassword ||
      !ci ||
      !acceso ||
      !idioma ||
      !categoria ||
      !agencia
    ) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
};

const verifySamePassword = (password, vpassword) => {
  return new Promise((resolve, reject) => {
    if (password === vpassword) {
      if (password.length >= 6) {
        resolve(true);
      } else {
        reject(true);
      }
    } else {
      reject(false);
    }
  });
};

const structureUser = (
  nombre,
  apPaterno,
  apMaterno,
  ci,
  correo,
  acceso,
  categoria,
  usuario,
  password,
  idUsuario,
  idioma,
  agencia,
  departamento
) => {
  const corpArray = ["1", "2", "5", "6", "7", "8", "9", "10"];
  const tipoUsuario = corpArray.includes(categoria)
    ? 1
    : categoria == 4
    ? 4
    : departamento == 1
    ? 2
    : 3;

  var userObject = {
    nombre: nombre,
    apPaterno: apPaterno,
    apMaterno: apMaterno,
    cedula: ci,
    correo: correo,
    acceso: acceso,
    rol: categoria,
    usuario: usuario,
    password: password,
    fultimoa: dateString(),
    fcreacion: dateString(),
    factualizacion: dateString(),
    usuariocrea: idUsuario,
    idioma: idioma,
    idAlmacen: agencia,
    idDepto: departamento,
    tipoUsuario: tipoUsuario,
  };

  return new Promise((resolve, reject) => {
    resolve(userObject);
  });
};

const createUser = (userObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/user`,
        userObject
      )
      .then((response) => {
        console.log("Error del post", response.message);
        resolve(response);
      })
      .catch((error) => {
        console.log("Error al guardar:", error.response.data.message);
        reject(error);
      });
  });
};

const userBasic = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/user/basic`
      )
      .then((response) => {
        console.log("Error del post", response.message);
        resolve(response);
      });
  });
};
export {
  controlUserInput,
  verifySamePassword,
  structureUser,
  createUser,
  userBasic,
};
