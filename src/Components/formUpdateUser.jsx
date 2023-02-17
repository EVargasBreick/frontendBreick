import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loading2 from "../assets/loading2.gif";
import { Form, Button, Alert, Image } from "react-bootstrap";
import { getLanguajes } from "../services/langServices";
import { getRoles } from "../services/rolServices";
import { getStores } from "../services/storeServices";
import {
  controlUserInput,
  verifySamePassword,
  structureUser,
  createUser,
} from "../services/userServices";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { getDepartamentos } from "../services/stateServices";
export default function FormUpdateUser() {
  const [nombre, setNombre] = useState("");
  const [apPaterno, setapPaterno] = useState("");
  const [apMaterno, setapMaterno] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [vPassword, setvPassword] = useState("");
  const [ci, setCi] = useState("");
  const [acceso, setAcceso] = useState("");
  const [email, setEmail] = useState("");
  const [idioma, setIdioma] = useState("");
  const [almacen, setAlmacen] = useState([{ Nombre: "cargando" }]);
  const [categoria, setCategoria] = useState("");
  const [agencia, setAgencia] = useState("");
  const [lang, setLang] = useState([]);
  const [roles, setRoles] = useState([]);
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [idUsuarioActual, setIdUsuarioActual] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [dpto, setDpto] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setIdUsuarioActual(JSON.parse(UsuarioAct).idUsuario);
    }
    const stores = getStores();
    stores.then((store) => {
      setAlmacen(store.data[0]);
    });
    const lang = getLanguajes();
    lang.then((l) => {
      setLang(l.data);
    });
    const rol = getRoles();
    rol.then((r) => {
      setRoles(r.data);
    });
    const deptos = getDepartamentos();
    deptos.then((dp) => {
      setDepartamentos(dp.data);
    });
  }, []);
  function userVerification() {
    const verifyInput = controlUserInput(
      nombre,
      apPaterno,
      apMaterno,
      email,
      usuario,
      password,
      vPassword,
      ci,
      acceso,
      idioma,
      categoria,
      agencia
    );
    verifyInput.then((res) => {
      if (res) {
        const verifyPassword = verifySamePassword(password, vPassword);

        verifyPassword
          .then((res) => {
            const object = structureUser(
              nombre,
              apPaterno,
              apMaterno,
              ci,
              email,
              acceso,
              categoria,
              usuario,
              password,
              idUsuarioActual,
              idioma,
              agencia,
              agencia,
              dpto
            );
            object.then((obj) => {
              guardar(obj);
            });
          })
          .catch((res) => {
            if (res) {
              setAlert("La contraseña debe contener al menos 6 caracteres");
              setIsAlert(true);
            } else {
              setAlert("Las contraseñas deben coincidir");
              setIsAlert(true);
            }
          });
        setIsAlert(false);
        setAlert("");
      } else {
        setAlert("Complete todos los campos por favor");
        setIsAlert(true);
      }
    });
  }
  function guardar(obj) {
    setisLoading(true);
    const userCreated = createUser(obj);
    userCreated
      .then((res) => {
        setIsAlert(true);
        setAlert("Usuario creado correctamente");

        setTimeout(() => {
          navigate("/principal");
          setisLoading(false);
        }, 3000);
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("The duplicate key value is")) {
          const errorM = error.response.data.message.split(
            "The duplicate key value is"
          );
          const errorDisplay =
            "El valor(es) " +
            errorM[1] +
            " ya se encuentra en la base de datos y no puede ser registrado nuevamente";
          console.log("Error desde el front", errorDisplay);
          setAlert(errorDisplay);
        }

        setIsAlert(true);
        setisLoading(false);
      });
  }
  function prepareStoreId(id) {
    const idSub = id.split(" ");
    if (idSub[1]) {
      setAgencia(idSub[0]);
    } else {
      setAgencia(id + "");
    }
  }
  return (
    <div>
      <div className="formLabel">CREAR NUEVO USUARIO</div>
      <Alert
        variant="danger"
        show={isAlert}
        style={{ backgroundColor: "#5cb8b2", color: "white" }}
      >
        {alert}
      </Alert>
      <div className="halfContainer">
        <div className="half">Datos Personales</div>
        <div className="half">Datos de acceso</div>
      </div>
      <Form>
        <div className="halfContainer">
          <Form.Group className="half" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ingrese nombre"
            />
          </Form.Group>
          <Form.Group className="half" controlId="user">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="ingrese usuario"
            />
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="surname">
            <Form.Label>Ap. Paterno</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setapPaterno(e.target.value)}
              placeholder="ingrese apellido"
            />
          </Form.Group>
          <Form.Group className="half" controlId="access">
            <Form.Label>Acceso</Form.Label>
            <Form.Select onChange={(e) => setAcceso(e.target.value)}>
              <option>Seleccione acceso</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="lastName">
            <Form.Label>Ap. Materno</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setapMaterno(e.target.value)}
              placeholder="ingrese apellido"
            />
          </Form.Group>
          <Form.Group className="half" controlId="category">
            <Form.Label>Categoria</Form.Label>
            <Form.Select onChange={(e) => setCategoria(e.target.value)}>
              <option>Seleccione Categoria</option>
              {roles.map((rol) => {
                return (
                  <option value={rol.idCategoria} key={rol.idCategoria}>
                    {rol.categoria}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="ci">
            <Form.Label>CI/Documento</Form.Label>
            <Form.Control
              onChange={(e) => setCi(e.target.value)}
              type="text"
              placeholder="ingrese numero de documento"
            />
          </Form.Group>
          <Form.Group className="half" controlId="languaje">
            <Form.Label>Idioma</Form.Label>
            <Form.Select onChange={(e) => setIdioma(e.target.value)}>
              <option>Seleccione Idioma</option>
              {lang.map((l) => {
                return (
                  <option value={l.idLenguaje} key={l.idLenguaje}>
                    {l.lenguaje}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="email">
            <Form.Label>Correo Electronico</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ingrese correo"
            />
          </Form.Group>
          <Form.Group className="half" controlId="formBasicEmail">
            <Form.Label>Agencia</Form.Label>
            <Form.Select
              value={agencia}
              onChange={(e) => {
                prepareStoreId(e.target.value);
              }}
            >
              <option>Seleccione Agencia</option>
              {almacen.map((ag) => {
                return (
                  <option value={ag.Nombre} key={ag.Nombre}>
                    {ag.Nombre}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId=""></Form.Group>
          <Form.Group className="half" controlId="state">
            <Form.Label>Ubicacion</Form.Label>
            <Form.Select onChange={(e) => setDpto(e.target.value)}>
              <option>Seleccione Departamento</option>
              {departamentos.map((dp, index) => {
                return (
                  <option value={dp.idDepto} key={index}>
                    {dp.departamento}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="halfContainer">
          <Form.Group className="half" controlId="create">
            <div className="buttonsLarge">
              <Button
                variant="warning"
                className="cyanLarge"
                onClick={() => {
                  userVerification();
                }}
              >
                {isLoading ? (
                  <Image src={loading2} style={{ width: "5%" }} />
                ) : (
                  "Crear"
                )}
              </Button>
            </div>
          </Form.Group>
        </div>
      </Form>
      <div className="secondHalf">
        <Form></Form>
      </div>
    </div>
  );
}
