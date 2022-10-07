import axios from "axios";
import config from "../config.json";

const verifyClientEmail = (email, isCorreo) => {
  const emailArray = email.split("@");
  return new Promise((resolve, reject) => {
    if (!email && !isCorreo) {
      reject("Recuerde preguntar el correo del cliente");
    } else {
      if (emailArray[1]) {
        resolve("v");
      } else {
        if (isCorreo) {
          resolve("v");
        } else {
          reject("El correo provisto no es válido, ingrese otro por favor");
        }
      }
    }
  });
};

const verifyClientPhone = (phone, isTelef) => {
  return new Promise((resolve, reject) => {
    if (isTelef) {
      resolve("Teléfono válido");
    } else {
      if (phone) {
        resolve("Teléfono válido");
      } else {
        reject("Recuerde preguntar el teléfono del cliente");
      }
    }
  });
};

const verifyClientAdress = (address, isAdress) => {
  return new Promise((resolve, reject) => {
    if (isAdress) {
      resolve("Direccion valida");
    } else {
      if (address) {
        resolve("Direccion válida");
      } else {
        reject("Recuerde preguntar la dirección del cliente");
      }
    }
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
    console.log("Razon social:", razonSocial);
    console.log("Nit:", nit);
    console.log("Zona:", zona);
    console.log("Idioma:", idioma);
    console.log("Tipo Precio:", tipoPrecio);
    console.log("Frecuencia:", frecuencia);
    console.log("Id vendedor", vendedor);
    if (
      razonSocial &&
      nit &&
      zona &&
      idioma &&
      tipoPrecio &&
      frecuencia &&
      vendedor &&
      nombre &&
      telefono
    ) {
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
  idVendedor
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
    fechaCrea: new Date(),
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
  telefcc
) => {
  console.log("Nombres:", nombreca, nombrecb, nombrecc);
  console.log("Correos:", correoca, correocb, correocc);
  console.log("telefonos:", telefca, telefcb, telefcc);
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
  console.log("Nombres:", nombreca, nombrecb, nombrecc);
  console.log("Correos:", correoca, correocb, correocc);
  console.log("telefonos:", telefca, telefcb, telefcc);
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
      .post(`${config.endpointUrl}:${config.endpointPort}/client`, clientObject)
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
        `${config.endpointUrl}:${config.endpointPort}/client?id=${id}`,
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
    console.log(
      "Datos ya en el endpoint:",
      contacto.nombre,
      contacto.correo,
      contacto.telefono
    );
    if (contacto.nombre && contacto.telefono) {
      axios
        .post(`${config.endpointUrl}:${config.endpointPort}/contact`, {
          idCliente: idCliente,
          nombre: contacto.nombre,
          correo: contacto.correo,
          telefono: contacto.telefono,
        })
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
  return new Promise((resolve, reject) => {
    console.log(
      "Datos ya en el endpoint:",
      contacto.nombre,
      contacto.correo,
      contacto.telefono
    );
    if (!contacto.idContacto) {
      if (contacto.nombre && contacto.telefono) {
        axios
          .post(`${config.endpointUrl}:${config.endpointPort}/contact`, {
            idCliente: idCliente,
            nombre: contacto.nombre,
            correo: contacto.correo,
            telefono: contacto.telefono,
          })
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
        axios
          .put(
            `${config.endpointUrl}:${config.endpointPort}/contact?id=${contacto.idContacto}`,
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
        `${config.endpointUrl}:${config.endpointPort}/client/rs?search=${search}`
      )
      .then((response) => {
        console.log("Clienteeeees:", response.data);
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
      .get(`${config.endpointUrl}:${config.endpointPort}/client?id=${id}`)
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
      .get(`${config.endpointUrl}:${config.endpointPort}/client/full?id=${id}`)
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
      .get(`${config.endpointUrl}:${config.endpointPort}/contact?id=${id}`)
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
};
