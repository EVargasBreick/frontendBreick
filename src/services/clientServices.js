import axios from "axios";

import { dateString } from "./dateServices";

const verifyClientEmail = (email, isCorreo) => {
  const emailArray = email.split("@");
  return new Promise((resolve, reject) => {
    /* if (!email && !isCorreo) {
      resolve("v");
    } else {
      if (emailArray[1]) {
        resolve("v");
      } else {
        if (isCorreo) {
          resolve("v");
        } else {
          resolve("v");
        }
      }
    }*/
    resolve("v");
  });
};

const verifyClientPhone = (phone, isTelef) => {
  return new Promise((resolve, reject) => {
    /*
    if (isTelef) {
      resolve("Teléfono válido");
    } else {
      if (phone) {
        resolve("Teléfono válido");
      } else {
        resolve("Teléfono válido");
      }
    }*/
    resolve("Telefono valido");
  });
};

const verifyClientAdress = (address, isAdress) => {
  return new Promise((resolve, reject) => {
    /*
    if (isAdress) {
      resolve("Direccion valida");
    } else {
      if (address) {
        resolve("Direccion válida");
      } else {
        resolve("Direccion válida");
      }
    }*/
    resolve("Direccion valida");
  });
};

const verifyOblFields = (
  razonSocial,
  nit,
  zona,
  idioma,
  tipoPrecio,
  frecuencia,
  vendedor,
  nombre,
  telefono
) => {
  return new Promise((resolve, reject) => {
    if (razonSocial && nit && zona) {
      resolve("Campos obligatorios llenos");
    } else {
      reject("Por favor, ingrese todos los campos obligatorios (*)");
    }
  });
};

const structureClient = (
  razonSocial,
  Nit,
  correo,
  zona,
  activo,
  dira,
  dirb,
  dirc,
  cpa,
  cpb,
  cpc,
  tela,
  telb,
  telc,
  idioma,
  tipoPrecio,
  frecuencia,
  usuario,
  notas,
  idVendedor,
  tipoDoc
) => {
  const telefonos = tela + "|" + telb + "|" + telc;
  const direcciones = dira + "|" + dirb + "|" + dirc;
  const codPostales = cpa + "|" + cpb + "|" + cpc;
  const clientObject = {
    razonSocial: razonSocial,
    nit: Nit,
    correo: correo,
    direccion: direcciones,
    codPostal: codPostales,
    telefono: telefonos,
    activo: activo,
    lenguaje: idioma,
    frecuencia: frecuencia,
    notas: notas,
    idZona: zona,
    tipoPrecio: tipoPrecio,
    usuarioCrea: usuario,
    idVendedor: idVendedor,
    fechaCrea: dateString(),
    tipoDocumento: tipoDoc,
  };
  return new Promise((resolve) => {
    resolve(clientObject);
  });
};

const structureContacts = (
  nombreca,
  correoca,
  telefca,
  nombrecb,
  correocb,
  telefcb,
  nombrecc,
  correocc,
  telefcc,
  idca,
  idcb,
  idcc
) => {
  var contactoArray = [];
  var contactoa = {
    nombre: nombreca,
    correo: correoca,
    telefono: telefca,
  };
  var contactob = {
    nombre: nombrecb,
    correo: correocb,
    telefono: telefcb,
  };
  var contactoc = {
    nombre: nombrecc,
    correo: correocc,
    telefono: telefcc,
  };
  contactoArray.push(contactoa);
  contactoArray.push(contactob);
  contactoArray.push(contactoc);
  return new Promise((resolve) => {
    resolve(contactoArray);
  });
};

const structureEditContacts = (
  nombreca,
  correoca,
  telefca,
  nombrecb,
  correocb,
  telefcb,
  nombrecc,
  correocc,
  telefcc,
  idca,
  idcb,
  idcc
) => {
  var contactoArray = [];
  var contactoa = {
    idContacto: idca,
    nombre: nombreca,
    correo: correoca,
    telefono: telefca,
  };
  var contactob = {
    idContacto: idcb,
    nombre: nombrecb,
    correo: correocb,
    telefono: telefcb,
  };
  var contactoc = {
    idContacto: idcc,
    nombre: nombrecc,
    correo: correocc,
    telefono: telefcc,
  };
  contactoArray.push(contactoa);
  contactoArray.push(contactob);
  contactoArray.push(contactoc);
  return new Promise((resolve) => {
    resolve(contactoArray);
  });
};

const createClient = (clientObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/client`,
        clientObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createClientPos = (clientObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/clientpos`,
        clientObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateClient = (clientObject, id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/client?id=${id}`,
        clientObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createContact = (contacto, idCliente) => {
  return new Promise((resolve, reject) => {
    if (contacto.nombre && contacto.telefono) {
      axios
        .post(
          `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/contact`,
          {
            idCliente: idCliente,
            nombre: contacto.nombre,
            correo: contacto.correo,
            telefono: contacto.telefono,
          }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      resolve("contacto vacio");
    }
  });
};

const updateContact = (contacto, idCliente) => {
  console.log("Contacto", contacto);
  return new Promise((resolve, reject) => {
    if (!contacto.idContacto) {
      if (contacto.nombre && contacto.telefono) {
        console.log("Creando contacto");
        axios
          .post(
            `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/contact`,
            {
              idCliente: idCliente,
              nombre: contacto.nombre,
              correo: contacto.correo,
              telefono: contacto.telefono,
            }
          )
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve("contacto vacio");
      }
    } else {
      if (contacto.nombre && contacto.telefono) {
        console.log("Updateando contacto");
        axios
          .put(
            `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/contact?id=${contacto.idContacto}`,
            {
              idCliente: idCliente,
              nombre: contacto.nombre,
              correo: contacto.correo,
              telefono: contacto.telefono,
            }
          )
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve("contacto vacio");
      }
    }
  });
};

const getClient = (search) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/client/rs?search=${search}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getClientById = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/client?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getFullClient = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/client/full?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getContact = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/contact?id=${id}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const numberOfClients = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/client/count`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  verifyClientEmail,
  verifyClientPhone,
  verifyClientAdress,
  verifyOblFields,
  structureClient,
  structureContacts,
  structureEditContacts,
  createClient,
  createContact,
  getClient,
  getClientById,
  getContact,
  getFullClient,
  updateClient,
  updateContact,
  numberOfClients,
  createClientPos,
};
