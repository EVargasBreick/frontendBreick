import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loading2 from "../assets/loading2.gif";
import { Form, Button, Alert, Image, Modal, Table } from "react-bootstrap";
import { getLanguajes } from "../services/langServices";
import { getRoles } from "../services/rolServices";
import { getStores } from "../services/storeServices";
import {
  controlUserInput,
  verifySamePassword,
  structureUser,
  createUser,
  userService,
} from "../services/userServices";
import "../styles/generalStyle.css";
import Cookies from "js-cookie";
import { getDepartamentos } from "../services/stateServices";
import LoadingModal from "./Modals/loadingModal";
export default function FormUpdateUser() {
  const [nombre, setNombre] = useState("");
  const [apPaterno, setapPaterno] = useState("");
  const [apMaterno, setapMaterno] = useState("");
  const [usuario, setUsuario] = useState("");
  const [ci, setCi] = useState("");
  const [email, setEmail] = useState("");
  const [idioma, setIdioma] = useState("");
  const [almacen, setAlmacen] = useState([{ Nombre: "cargando" }]);
  const [categoria, setCategoria] = useState("");
  const [agencia, setAgencia] = useState("");
  const [lang, setLang] = useState([]);
  const [roles, setRoles] = useState([]);
  const [acceso, setAcceso] = useState("");
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [idUsuarioActual, setIdUsuarioActual] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [dpto, setDpto] = useState("");
  const [userList, setUserList] = useState([]);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [userData, setUserData] = useState({});
  const [isBlock, setIsBlock] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isUserModal, setIsUserModal] = useState(false);
  const [search, setSearch] = useState("");
  const [auxUserList, setAuxUserList] = useState([]);
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setIdUsuarioActual(JSON.parse(UsuarioAct).idUsuario);
    }

    const stores = getStores();
    stores.then((store) => {
      //console.log("Almacen", store.data);
      setAlmacen(store.data);
    });
    const lang = getLanguajes();
    lang.then((l) => {
      setLang(l.data);
    });
    const rol = getRoles();
    rol.then((r) => {
      //console.log("Roles", r.data);
      setRoles(r.data);
    });
    const deptos = getDepartamentos();
    deptos.then((dp) => {
      setDepartamentos(dp.data);
    });

    const usuarios = userService.getAll();
    usuarios.then((us) => {
      if (JSON.parse(UsuarioAct).rol == 1) {
        console.log("User list", us);
        setUserList(us);
        setAuxUserList(us);
      } else {
        const rolist = [2, 3, 4, 6, 9, 11];
        const filtered = us.filter((user) => rolist.includes(user.rol));
        setUserList(filtered);
        setAuxUserList(filtered);
      }
    });
  }, []);

  useEffect(() => {
    if (isUserModal) {
      setIsUserSelected(true);
    } else {
      setTimeout(() => {
        setIsUserSelected(false);
      }, 300);
    }
  }, [isUserModal]);

  const handleSelectedUser = (user) => {
    setNombre(user.nombre);
    setUsuario(user.usuario);
    setapPaterno(user.apPaterno);
    setapMaterno(user.apMaterno);
    setCategoria(user.rol);
    setIdioma(user.idioma);
    setCi(user.cedula);
    setEmail(user.correo);
    setDpto(user.idDepto);
    setAcceso(user.acceso);
    setUserData(user);
    setIsUserModal(true);
  };

  function handleBlock(user) {
    console.log("Entro a block");
    setUserData(user);
    setIsBlock(true);
  }

  async function blockUnblockUser() {
    setIsBlock(false);
    setAlertSec("Actualizando acceso");
    setIsAlertSec(true);
    const userBody = {
      nombre: userData.nombre,
      apPaterno: userData.apPaterno,
      apMaterno: userData.apMaterno,
      cedula: userData.cedula,
      correo: userData.correo,
      acceso: userData.acceso == 1 ? 0 : 1,
      idDepto: userData.idDepto,
      rol: userData.rol,
      idioma: userData.idioma,
      usuario: userData.usuario,
    };
    const idUsuario = userData.idUsuario;
    try {
      const updated = await userService.updateUserAll(idUsuario, userBody);
      console.log("Acceso actualizado", updated);
      setAlertSec("Acceso actualizado correctamente!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log("Error al actualizar acceso", error);
    }
  }

  async function updateUser(e) {
    e.preventDefault();
    setIsBlock(false);
    setAlertSec("Actualizando usuario");
    setIsAlertSec(true);
    const userBody = {
      nombre: nombre,
      apPaterno: apPaterno,
      apMaterno: apMaterno,
      cedula: ci,
      correo: email,
      acceso: acceso,
      idDepto: dpto,
      rol: categoria,
      idioma: idioma,
      usuario: usuario,
    };
    const idUsuario = userData.idUsuario;
    try {
      const updated = await userService.updateUserAll(idUsuario, userBody);
      setAlertSec("Usuario actualizado correctamente!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log("Error al actualizar usuario", error);
    }
  }

  function validateFields(e) {
    e.preventDefault();
    if (
      nombre.length < 2 ||
      apPaterno.length < 2 ||
      ci.length < 1 ||
      email.length < 2 ||
      usuario.length < 2
    ) {
      setAlertSec("Verifique que todos los campos sean válidos por favor");
      setIsAlertSec(true);
      setTimeout(() => {
        setIsAlertSec(false);
      }, 2000);
    } else {
      updateUser(e);
    }
  }

  function handleEscape() {
    setUserData({});
    setIsUserModal(false);
    setIsBlock(false);
  }

  function filterUser(value) {
    setSearch(value);
    const filtered = auxUserList.filter((al) =>
      al.nombre.toLowerCase().includes(value.toLowerCase())
    );
    if (filtered.length > 0) {
      setUserList(filtered);
    }
  }

  return (
    <div onKeyDown={(e) => (e.key === "Escape" ? handleEscape() : null)}>
      <div className="formLabel">EDITAR USUARIO</div>
      <Alert
        variant="danger"
        show={isAlert}
        style={{ backgroundColor: "#5cb8b2", color: "white" }}
      >
        {alert}
      </Alert>
      <div style={{ margin: "10px" }}>
        <Form>
          <Form.Control
            value={search}
            onChange={(e) => filterUser(e.target.value)}
            placeholder="buscar por nombre"
          />
        </Form>
      </div>
      {isUserSelected ? (
        <Modal show={isUserModal} size="lg">
          <div style={{ margin: "20px" }}>
            <div className="halfContainer">
              <div className="half">Datos del Usuario</div>
            </div>
            <Form
              onSubmit={(e) => validateFields(e)}
              onKeyDown={(e) => (e.key === "Escape" ? handleEscape() : null)}
            >
              <div className="halfContainer">
                <Form.Group className="half" controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    isInvalid={nombre.length < 3}
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="ingrese nombre"
                  />
                  {nombre.length < 3 ? (
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        marginTop: "2px",
                        fontSize: "small",
                        color: "red",
                      }}
                    >
                      Ingrese un nombre válido por favor
                    </Form.Label>
                  ) : null}
                </Form.Group>
                <Form.Group className="half" controlId="user">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    isInvalid={usuario.length < 3}
                    value={usuario}
                    type="text"
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="ingrese usuario"
                  />
                  {usuario.length < 3 ? (
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        marginTop: "2px",
                        fontSize: "small",
                        color: "red",
                      }}
                    >
                      Ingrese un usuario válido por favor
                    </Form.Label>
                  ) : null}
                </Form.Group>
              </div>
              <div className="halfContainer">
                <Form.Group className="half" controlId="surname">
                  <Form.Label>Ap. Paterno</Form.Label>
                  <Form.Control
                    isInvalid={apPaterno.length < 3}
                    type="text"
                    value={apPaterno}
                    onChange={(e) => setapPaterno(e.target.value)}
                    placeholder="ingrese apellido"
                  />
                  {apPaterno.length < 3 ? (
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        marginTop: "2px",
                        fontSize: "small",
                        color: "red",
                      }}
                    >
                      Ingrese un apellido paterno válido por favor
                    </Form.Label>
                  ) : null}
                </Form.Group>
                <Form.Group className="half" controlId="lastName">
                  <Form.Label>Ap. Materno</Form.Label>
                  <Form.Control
                    type="text"
                    value={apMaterno}
                    onChange={(e) => setapMaterno(e.target.value)}
                    placeholder="ingrese apellido"
                  />
                </Form.Group>
              </div>
              <div className="halfContainer">
                <Form.Group className="half" controlId="category">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select onChange={(e) => setCategoria(e.target.value)}>
                    <option>
                      {
                        roles.find((rl) => rl.idCategoria == categoria)
                          .categoria
                      }
                    </option>

                    {roles.map((rol) => {
                      if (
                        rol.idCategoria !=
                        roles.find((rl) => rl.idCategoria == categoria)
                          .idCategoria
                      ) {
                        return (
                          <option value={rol.idCategoria} key={rol.idCategoria}>
                            {rol.categoria}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="half" controlId="ci">
                  <Form.Label>CI/Documento</Form.Label>
                  <Form.Control
                    isInvalid={ci.length < 1}
                    value={ci}
                    onChange={(e) => setCi(e.target.value)}
                    type="number"
                    placeholder="ingrese numero de documento"
                  />
                  {ci.length < 1 ? (
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        marginTop: "2px",
                        fontSize: "small",
                        color: "red",
                      }}
                    >
                      Ingrese una cédula válida por favor
                    </Form.Label>
                  ) : null}
                </Form.Group>
              </div>
              <div className="halfContainer">
                <Form.Group className="half" controlId="languaje">
                  <Form.Label>Idioma</Form.Label>
                  <Form.Select onChange={(e) => setIdioma(e.target.value)}>
                    <option>
                      {lang.find((lg) => lg.idLenguaje == idioma).lenguaje}
                    </option>
                    {lang.map((l) => {
                      if (l.idLenguaje != idioma) {
                        return (
                          <option value={l.idLenguaje} key={l.idLenguaje}>
                            {l.lenguaje}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="half" controlId="email">
                  <Form.Label>Correo Electronico</Form.Label>
                  <Form.Control
                    isInvalid={email.length < 3}
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ingrese correo"
                  />
                  {email.length < 3 ? (
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        marginTop: "2px",
                        fontSize: "small",
                        color: "red",
                      }}
                    >
                      Ingrese un correo válido por favor
                    </Form.Label>
                  ) : null}
                </Form.Group>
              </div>
              <div className="halfContainer"></div>
              <div className="halfContainer">
                <Form.Group className="half" controlId="state">
                  <Form.Label>Ubicacion</Form.Label>
                  <Form.Select onChange={(e) => setDpto(e.target.value)}>
                    <option>
                      {
                        departamentos.find((dp) => dp.idDepto == dpto)
                          .departamento
                      }
                    </option>
                    {departamentos.map((dp, index) => {
                      if (dp.idDepto != dpto) {
                        return (
                          <option value={dp.idDepto} key={index}>
                            {dp.departamento}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="halfContainer">
                <Form.Group className="half" controlId="create">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      margin: "20px",
                    }}
                  >
                    <Button
                      variant="success"
                      onClick={(e) => {
                        validateFields(e);
                      }}
                    >
                      {isLoading ? (
                        <Image src={loading2} style={{ width: "5%" }} />
                      ) : (
                        "Actualizar"
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setIsUserModal(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form.Group>
              </div>
            </Form>
          </div>
        </Modal>
      ) : null}

      <Table striped bordered>
        <thead>
          <tr className="tableHeader">
            <th>Nombre</th>
            <th>Agencia</th>
            <th>Rol</th>
            <th>Acceso</th>
            <th>Ed. Acceso</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((ul, index) => {
            const finded =
              almacen.length > 0
                ? almacen?.find((alm) => alm.idAgencia == ul.idAlmacen)
                : null;

            const spplited = finded ? finded?.Nombre.split(" ") : null;
            const agName = spplited
              ? spplited[1]
                ? spplited.slice(1).join(" ")
                : spplited[0]
              : "Cargando...";
            const role =
              roles.length > 0
                ? roles.find((rl) => rl.idCategoria == ul.rol)
                : "";
            return (
              <tr key={index} className="tableRow">
                <th>{ul.nombre + " " + ul.apPaterno}</th>
                <th>{agName}</th>
                <th>{role.categoria}</th>
                <th>{ul.acceso == 1 ? "Activo" : "Bloqueado"}</th>
                <th>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant={ul.acceso == 1 ? "danger" : "success"}
                      onClick={() => handleBlock(ul)}
                    >
                      {ul.acceso == 1 ? "Bloquear" : "Desbloquear"}
                    </Button>
                  </div>
                </th>
                <th>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="warning"
                      onClick={() => handleSelectedUser(ul)}
                    >
                      Editar
                    </Button>
                  </div>
                </th>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal show={isBlock}>
        <Modal.Header>Mensaje de sistema</Modal.Header>
        <Modal.Body>
          {`Está seguro que quiere ${
            userData?.acceso == 1 ? "Bloquear" : "Desbloquear"
          } este usuario?`}
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <Button variant="success" onClick={() => blockUnblockUser()}>
              Confirmar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsBlock(false);
                setUserData({});
              }}
            >
              Cancelar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec}></LoadingModal>
    </div>
  );
}
