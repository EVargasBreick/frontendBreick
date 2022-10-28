import axios from "axios";
import config from "../config.json";
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
    console.log(
      "Objecto",
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
    );
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
  agencia
) => {
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
  };
  return new Promise((resolve, reject) => {
    resolve(userObject);
  });
};

const createUser = (userObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.endpointUrl}:${config.endpointPort}/user`, userObject)
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
      .get(`${config.endpointUrl}:${config.endpointPort}/user/basic`)
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
