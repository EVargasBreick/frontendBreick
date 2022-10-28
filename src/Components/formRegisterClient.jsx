import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Modal, Alert, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/formLayouts.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getLanguajes } from "../services/langServices";
import { getDias, getZonas } from "../services/miscServices";
import { userBasic } from "../services/userServices";
import Cookies from "js-cookie";
import {
  createClient,
  createContact,
  structureClient,
  structureContacts,
  verifyClientAdress,
  verifyClientEmail,
  verifyClientPhone,
  verifyOblFields,
} from "../services/clientServices";
import { useNavigate } from "react-router-dom";
export default function FormRegisterClient() {
  const [active, setActive] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [razonSocial, setRazonSocial] = useState("");

  const [nit, setNit] = useState("");
  const [correo, setCorreo] = useState("");
  const [zona, setZona] = useState("");
  const [dira, setDira] = useState("");
  const [dirb, setDirb] = useState("");
  const [dirc, setDirc] = useState("");
  const [cpa, setCpa] = useState("");
  const [cpb, setCpb] = useState("");
  const [cpc, setCpc] = useState("");
  const [tela, setTela] = useState("");
  const [telb, setTelb] = useState("");
  const [telc, setTelc] = useState("");
  const [idioma, setIdioma] = useState(1);
  const [tipoP, setTipop] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [usuario, setUsuario] = useState("");
  const [notas, setNotas] = useState("");
  const [gZonas, setgZonas] = useState([]);
  const [nombreca, setNombreca] = useState("");
  const [correoca, setCorreoca] = useState("");
  const [telefca, setTelefca] = useState("");
  const [nombrecb, setNombrecb] = useState("");
  const [correocb, setCorreocb] = useState("");
  const [telefcb, setTelefcb] = useState("");
  const [nombrecc, setNombrecc] = useState("");
  const [correocc, setCorreocc] = useState("");
  const [telefcc, setTelefcc] = useState("");
  const [lang, setLang] = useState([]);
  const [usArray, setUsArray] = useState([]);
  const [diasArray, setDiasArray] = useState([]);
  const [isButton, setIsButton] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isCorreoA, setIsCorreoA] = useState(false);
  const [isPhoneA, setIsPhoneA] = useState(false);
  const [isAdress, setIsAdress] = useState(false);
  const [cTested, setcTested] = useState(false);
  const [pTested, setpTested] = useState(false);
  const [dTested, setdTested] = useState(false);
  const navigate = useNavigate();
  const [idUsuarioActual, setIdUsuarioActual] = useState();
  const handleClose = () => {
    setIsAlert(false);
    setIsButton(false);
    if (cTested) {
      if (!isCorreoA) {
        setIsCorreoA(true);
      }
    }
    if (pTested) {
      if (!isPhoneA) {
        setIsPhoneA(true);
      }
    }
    if (dTested) {
      if (!isAdress) {
        setIsAdress(true);
      }
    }
  };
  useEffect(() => {
    console.log("Userrr", Cookies.get("userAuth"));
    if (Cookies.get("userAuth")) {
      setIdUsuarioActual(JSON.parse(Cookies.get("userAuth")).idUsuario);
    }

    const usuarios = userBasic();
    usuarios.then((usu) => {
      setUsArray(usu.data[0]);
    });
    const langu = getLanguajes();
    langu.then((l) => {
      console.log("Lenguajes", l.data[0]);
      setLang(l.data[0]);
    });
    const zon = getZonas();
    zon.then((z) => {
      setgZonas(z.data[0]);
    });
    const dias = getDias();
    dias.then((dia) => {
      setDiasArray(dia.data[0]);
    });
  }, []);

  function verifyInputs() {
    const obFields = verifyOblFields(
      razonSocial,
      nit,
      zona,
      idioma,
      tipoP,
      frecuencia,
      usuario,
      nombreca,
      telefca
    );
    obFields
      .then((res) => {
        const response = verifyClientEmail(correo, isCorreoA);
        response
          .then((res) => {
            setcTested(true);
            const phoneRes = verifyClientPhone(tela, isPhoneA);
            phoneRes
              .then((res) => {
                setpTested(true);
                console.log(res);
                const addressRes = verifyClientAdress(dira, isAdress);
                addressRes
                  .then((res) => {
                    setdTested(true);
                    const clientObject = structureClient(
                      razonSocial,
                      nit,
                      correo,
                      zona,
                      active ? "1" : "0",
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
                      tipoP,
                      frecuencia,
                      idUsuarioActual,
                      notas,
                      usuario
                    );
                    clientObject.then((client) => {
                      if (
                        (nombrecb && telefcb) ||
                        (nombrecc && telefcc) ||
                        (!nombrecb && !nombrecc && !telefcb && !telefcc)
                      ) {
                        const contactosObject = structureContacts(
                          nombreca,
                          correoca,
                          telefca,
                          nombrecb,
                          correocb,
                          telefcb,
                          nombrecc,
                          correocc,
                          telefcc
                        );
                        contactosObject.then((contactObject) => {
                          console.log("Objeto contacto", contactObject);
                          setisLoading(true);
                          const newClient = createClient(client);
                          newClient
                            .then((res) => {
                              const newId = res.data.createdId;
                              console.log(
                                "Id recien creado",
                                res.data.createdId
                              );
                              contactObject.map((contact) => {
                                const newContact = createContact(
                                  contact,
                                  newId
                                );
                                newContact
                                  .then((contact) => {
                                    setIsAlert(true);
                                    setAlert("Cliente creado correctamente");
                                    setTimeout(() => {
                                      navigate("/principal");
                                      setisLoading(false);
                                    }, 3000);
                                    console.log(contact);
                                  })
                                  .catch((err) => {
                                    console.log("Error en la creacion", err);
                                  });
                              });
                            })
                            .catch((err) => {
                              const errorMessage = err.response.data.message;
                              if (
                                errorMessage.includes(
                                  "The duplicate key value is"
                                )
                              ) {
                                const errorM = err.response.data.message.split(
                                  "The duplicate key value is"
                                );
                                const errorDisplay =
                                  "La combinación de Nit y Zona ya se encuentran registrada en la base de datos";
                                console.log(
                                  "Error desde el front",
                                  errorDisplay
                                );
                                setAlert(errorDisplay);
                              }

                              setIsAlert(true);
                              setisLoading(false);
                              console.log(err);
                            });
                        });
                      } else {
                        setIsAlert(true);
                        setAlert(
                          "En caso de proveer información de contacto, ingresar tanto nombre como teléfono de manera obligatoria"
                        );
                      }
                    });
                  })
                  .catch((err) => {
                    setdTested(true);
                    console.log(err);
                    setAlert(err);
                    setIsAlert(true);
                  });
              })
              .catch((err) => {
                setpTested(true);
                console.log(err);
                setAlert(err);
                setIsAlert(true);
              });

            console.log("Correo provisto", res);
          })
          .catch((error) => {
            setcTested(true);
            if (error === "Recuerde preguntar el correo del cliente") {
              setAlert(error);
              setIsAlert(true);
              setIsButton(true);
            } else {
              setAlert(error);
              setIsAlert(true);
            }
            console.log("Error:", error);
          });
      })
      .catch((err) => {
        setAlert(err);
        setIsAlert(true);
      });
  }
  return (
    <div>
      <div className="formLabel">REGISTRAR CLIENTES</div>

      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ALERTA</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Confirmo, cerrar alerta
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="createContainer">
        <div className="clientData">
          <div className="division">
            <div className="line">Datos del cliente</div>
            <Form>
              <Form.Group className="completeHalf" controlId="comName">
                <Form.Label>Nombre Comercial*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Razon social"
                  value={razonSocial}
                  onChange={(e) => {
                    setRazonSocial(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="productName">
                <Form.Label>NIT*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese Nit"
                  value={nit}
                  onChange={(e) => {
                    setNit(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="completeHalf" controlId="comName">
                <Form.Label>Correo electronico</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="selectHalf" controlId="productType">
                <Form.Label>Zona*</Form.Label>
                <Form.Select
                  onChange={(e) => {
                    setZona(e.target.value);
                  }}
                >
                  <option>S/Z</option>
                  {gZonas.map((z) => {
                    return (
                      <option value={z.idZona} key={z.idZona}>
                        {z.zona}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="halfRadio" controlId="productDisccount">
                <Form.Check
                  defaultChecked={active}
                  onClick={() => setActive(!active)}
                  type="switch"
                  label={active ? "Activo" : "No activo"}
                  id="custom-switch"
                />
              </Form.Group>
            </Form>
          </div>
          <div className="division">
            <div className="line">Direcciones</div>
            <Form>
              <div className="adresses">
                <div className="adress">
                  <Form.Group className="completeHalf" controlId="comName">
                    <Form.Label>Direccion 1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Direccion 1..."
                      value={dira}
                      onChange={(e) => {
                        setDira(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="completeHalf" controlId="comName">
                    <Form.Label>Direccion 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Direccion 2..."
                      value={dirb}
                      onChange={(e) => {
                        setDirb(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="completeHalf" controlId="comName">
                    <Form.Label>Direccion 3</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Direccion 3..."
                      value={dirc}
                      onChange={(e) => {
                        setDirc(e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="postalCode">
                  <Form.Group className="completeHalf" controlId="pCode1">
                    <Form.Label>Cod Postal 1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Cod Postal 1..."
                      value={cpa}
                      onChange={(e) => {
                        setCpa(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="completeHalf" controlId="pCode2">
                    <Form.Label>Cod Postal 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Cod Postal 2..."
                      value={cpb}
                      onChange={(e) => {
                        setCpb(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="completeHalf" controlId="pCode3">
                    <Form.Label>Cod Postal 3</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Cod Postal 3..."
                      value={cpc}
                      onChange={(e) => {
                        setCpc(e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </div>
          <div className="division">
            <div className="line">Teléfonos</div>
            <Form>
              <div className="adresses">
                <div className="phone">
                  <Form.Group className="completeHalf" controlId="phone1">
                    <Form.Label>Telefono 1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese Telefono"
                      value={tela}
                      onChange={(e) => {
                        setTela(e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="phone">
                  <Form.Group className="completeHalf" controlId="phone2">
                    <Form.Label>Telefono 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese telefono"
                      value={telb}
                      onChange={(e) => {
                        setTelb(e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="phone">
                  <Form.Group className="completeHalf" controlId="phone3">
                    <Form.Label>Telefono 3</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese telefono"
                      value={telc}
                      onChange={(e) => {
                        setTelc(e.target.value);
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </div>
          <div className="division">
            <div className="line">Datos adicionales</div>
            <Form>
              <Form.Group className="selectHalf" controlId="productType">
                <Form.Select
                  onChange={(e) => {
                    setIdioma(e.target.value);
                  }}
                >
                  <option>- Seleccione idioma * -</option>

                  {lang.map((z) => {
                    return (
                      <option value={z.idLenguaje} key={z.idLenguaje}>
                        {z.lenguaje}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="selectHalf" controlId="productType">
                <Form.Select
                  onChange={(e) => {
                    setTipop(e.target.value);
                  }}
                >
                  <option> - Seleccione tipo de precio * -</option>
                  <option value="Normal" key="1">
                    Normal
                  </option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="selectHalf" controlId="productType">
                <Form.Select
                  onChange={(e) => {
                    setFrecuencia(e.target.value);
                  }}
                >
                  <option> - Seleccionar Frecuencia * - </option>
                  {diasArray.map((z) => {
                    return (
                      <option value={z.idDiasFrec} key={z.idDiasFrec}>
                        {z.dias}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="selectHalf" controlId="productType">
                <Form.Select
                  onChange={(e) => {
                    setUsuario(e.target.value);
                  }}
                >
                  <option> - Seleccionar Vendedor * -</option>
                  {usArray.map((z) => {
                    return (
                      <option value={z.idUsuario} key={z.idUsuario}>
                        {z.nombre}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        </div>
        <div className="contactInfo">
          <div className="division">
            <div className="line">Persona de contacto 1</div>

            <Form>
              <Form.Group className="completeHalf" controlId="contactName1">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre persona de contacto"
                  value={nombreca}
                  onChange={(e) => {
                    setNombreca(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="contactEmail1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo persona de contacto"
                  value={correoca}
                  onChange={(e) => {
                    setCorreoca(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="contactPhone1">
                <Form.Label>Telefono *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Telefono persona de contacto"
                  value={telefca}
                  onChange={(e) => {
                    setTelefca(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </div>
          <div className="division">
            <div className="line">Persona de contacto 2</div>
            <Form>
              <Form.Group className="completeHalf" controlId="contactName1">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre persona de contacto"
                  value={nombrecb}
                  onChange={(e) => {
                    setNombrecb(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="contactEmail1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={correocb}
                  onChange={(e) => {
                    setCorreocb(e.target.value);
                  }}
                  type="text"
                  placeholder="Correo persona de contacto"
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="contactPhone1">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Telefono persona de contacto"
                  value={telefcb}
                  onChange={(e) => {
                    setTelefcb(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </div>
          <div className="division">
            <div className="line">Persona de contacto 3</div>
            <Form>
              <Form.Group className="completeHalf" controlId="contactName1">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre persona de contacto"
                  value={nombrecc}
                  onChange={(e) => {
                    setNombrecc(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="contactEmail1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo persona de contacto"
                  value={correocc}
                  onChange={(e) => {
                    setCorreocc(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="completeHalf" controlId="contactPhone1">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Telefono persona de contacto"
                  value={telefcc}
                  onChange={(e) => {
                    setTelefcc(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </div>
          <div className="division">
            <div className="line">Notas adicionales</div>
            <Form>
              <Form.Group className="completeHalf" controlId="contactName1">
                <Form.Label>Inserte aqui notas adicionales</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  rows={"4"}
                  placeholder="..."
                  value={notas}
                  onChange={(e) => {
                    setNotas(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      <div className="secondHalf">
        <div className="buttons">
          <Button
            disabled={isButton}
            variant="warning"
            className="cyanLarge"
            onClick={() => {
              verifyInputs();
            }}
          >
            {isLoading ? (
              <Image src={loading2} style={{ width: "5%" }} />
            ) : (
              "Registrar Cliente"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
