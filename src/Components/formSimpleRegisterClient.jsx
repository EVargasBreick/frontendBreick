import React, { useState } from "react";
import { useEffect, useRef } from "react";
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
export default function FormSimpleRegisterClient(props) {
  const [active, setActive] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [razonSocial, setRazonSocial] = useState("");

  const [nit, setNit] = useState(props.nit);
  const [correo, setCorreo] = useState("");
  const [zona, setZona] = useState("1");
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
  const [tipoP, setTipop] = useState("Normal");
  const [frecuencia, setFrecuencia] = useState(1);
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
  const [tipoDoc, setTipoDoc] = useState("1");
  const [isCorreoA, setIsCorreoA] = useState(false);
  const [isPhoneA, setIsPhoneA] = useState(false);
  const [isAdress, setIsAdress] = useState(false);
  const [cTested, setcTested] = useState(false);
  const [pTested, setpTested] = useState(false);
  const [dTested, setdTested] = useState(false);
  const razonSocialref = useRef();
  const navigate = useNavigate();
  const [idUsuarioActual, setIdUsuarioActual] = useState();
  useEffect(() => {
    razonSocialref.current.focus();
  }, []);
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
    if (Cookies.get("userAuth")) {
      setIdUsuarioActual(JSON.parse(Cookies.get("userAuth")).idUsuario);
    }

    const usuarios = userBasic();
    usuarios.then((usu) => {
      setUsArray(usu.data);
    });
    const langu = getLanguajes();
    langu.then((l) => {
      setLang(l.data);
    });
    const zon = getZonas();
    zon.then((z) => {
      setgZonas(z.data);
    });
    const dias = getDias();
    dias.then((dia) => {
      setDiasArray(dia.data);
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
                      idUsuarioActual,
                      tipoDoc == undefined ? 1 : tipoDoc
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
                          setisLoading(true);
                          const newClient = createClient(client);
                          newClient
                            .then((res) => {
                              const newId = res.data.createdId;

                              contactObject.map((contact) => {
                                const newContact = createContact(
                                  contact,
                                  newId
                                );
                                newContact
                                  .then((contact) => {
                                    setIsAlert(true);
                                    setAlert("Cliente creado correctamente");
                                    if (props.isModal) {
                                      Cookies.set("nit", nit);
                                      setTimeout(() => {
                                        window.location.reload(false);
                                        setisLoading(false);
                                      }, 1000);
                                    } else {
                                      setTimeout(() => {
                                        navigate("/principal");
                                        setisLoading(false);
                                      }, 3000);
                                    }
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
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Confirmo, cerrar Mensaje del Sistema
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="createContainer">
        <div className="clientData">
          <div className="division">
            <div className="line">Datos del cliente</div>
            <Form>
              <Form.Group className="completeHalf" controlId="productName">
                <Form.Label>NIT/CI*</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese Nit"
                  value={nit}
                  onChange={(e) => {
                    setNit(e.target.value);
                  }}
                />

                <Form.Label>Razon Social*</Form.Label>
                <Form.Control
                  ref={razonSocialref}
                  type="text"
                  placeholder="Razon social"
                  value={razonSocial}
                  onChange={(e) => {
                    setRazonSocial(e.target.value);
                  }}
                  onKeyDown={(e) => (e.key === "Enter" ? verifyInputs() : null)}
                />

                <Form.Label>Tipo Documento</Form.Label>
                <Form.Select
                  onChange={(e) => {
                    setTipoDoc(e.target.value);
                  }}
                >
                  <option value="1">Cédula de Identidad</option>
                  <option value="2">Cédula de Identidad Extranjero</option>
                  <option value="3">Pasaporte</option>
                  <option value="4">Otro documento de identidad</option>
                  <option value="5">NIT</option>
                </Form.Select>
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
                  onKeyDown={(e) => (e.key === "Enter" ? verifyInputs() : null)}
                />
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
