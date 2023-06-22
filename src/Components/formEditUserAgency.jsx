import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { getStores } from "../services/storeServices";
import { Loader } from "./loader/Loader";
import { userService } from "../services/userServices";
import { set } from "lodash";
import { ConfirmModal } from "./Modals/confirmModal";
import ToastComponent from "./Modals/Toast";
export default function FormEditUserAgnecy() {
  const [agencies, setAgencies] = useState([]);
  const [agenciesAux, setAgenciesAux] = useState([]); //agencias auxiliares para filtrar por nombre
  const [selectedAgency, setSelectedAgency] = useState("");
  const [actualAgency, setActualAgency] = useState("");
  const [usuario, setUsuario] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const stores = getStores();
      stores.then((store) => {
        setAgencies(store.data);
        setAgenciesAux(store.data);
      });

      const users = userService.getAll("4,2");
      users.then((users) => {
        setUsers(users);
      });
    } catch (error) {
      setToastText(error?.response?.data?.error ?? "Error al cargar agencias");
      setToastType("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      const user = userService.findUser(usuario, "4,2");
      user.then((user) => {
        if (user) {
          setSelectedAgency(user.idAlmacen);
          setSelectedUser(user.idUsuario);
          setActualAgency(user.idAlmacen);
          if (user.idAlmacen.includes("-")) {
            setAgencies(agenciesAux.filter((ag) => ag.Nombre.includes("-")));
          } else {
            setAgencies(agenciesAux.filter((ag) => !ag.Nombre.includes("-")));
          }
        }
      });
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    setLoading(true);
    setShowModal(false);
    try {
      await userService.updateUser(selectedUser, {
        idAlmacen: selectedAgency,
      });
      const stores = getStores();
      stores.then((store) => {
        setAgencies(store.data);
      });
      setActualAgency(selectedAgency);

      const users = userService.getAll("4,2");
      users.then((users) => {
        setUsers(users);
      });
      setToastText("Usuario editado correctamente");
      setToastType("success");
    } catch (error) {
      setToastText(error?.response?.data?.error ?? "Error al editar usuario");
      setToastType("danger");
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <div>
      <ConfirmModal
        show={showModal}
        title={"Confirmar edicion de usuario"}
        text={"¿Esta seguro que desea cambiar la agencia del usuario?"}
        handleCancel={() => setShowModal(false)}
        handleSubmit={handleSubmit}
      />
      <ToastComponent
        show={showToast}
        setShow={setShowToast}
        autoclose={2}
        text={toastText}
        type={toastType}
      />
      <div className="formLabel">EDITAR AGENCIA DE USUARIO</div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
      >
        <div className="d-xl-flex justify-content-center gap-3">
          <Form.Group className="flex-grow-1">
            <Form.Label>Seleccionar Usuario</Form.Label>
            <Form.Select
              required
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setUsuario(
                  users.find((user) => user.idUsuario == e.target.value)
                    ?.nombre ?? ""
                );
              }}
            >
              <option value={null}>Seleccione Usuario</option>
              {users.map((user) => {
                return (
                  <option value={user.idUsuario} key={user.idUsuario}>
                    {user.nombre} {user.apPaterno}
                    {user.apMaterno}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="flex-grow-1">
            <Form.Label>Buscar Usuario por NOMBRE o APELLIDO o C.I.</Form.Label>
            <Form.Control
              type="text"
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                console.log(e.target.value);
                console.log(selectedUser);
              }}
              placeholder="Buscar Usuario"
            />
          </Form.Group>
        </div>

        {selectedUser && selectedUser !== "Seleccione Usuario" && (
          <>
            <div className="formLabel">
              EL USUARIO ACTUAL ESTA EN:{" "}
              <span className="text-warning fs-2">
                {actualAgency ??
                  agencies?.find((ag) => ag?.idAgencia == actualAgency).Nombre}
              </span>
            </div>
            <Form.Group>
              <Form.Label>Agencia</Form.Label>
              <Form.Select
                required
                value={selectedAgency}
                onChange={(e) => {
                  setSelectedAgency(e.target.value);
                }}
              >
                <option value={null}>Seleccione Agencia</option>
                {agencies.map((ag) => {
                  return (
                    <option value={ag.idAgencia} key={ag.idAgencia}>
                      {ag.Nombre}
                    </option>
                  );
                })}
              </Form.Select>
              {selectedAgency === "Seleccione Agencia" && (
                <Form.Text className="text-info text-uppercase">
                  Seleccione una agencia
                </Form.Text>
              )}
            </Form.Group>
          </>
        )}

        <Button
          disabled={
            !selectedUser ||
            !selectedAgency ||
            selectedAgency === "Seleccione Agencia" ||
            selectedUser === "Seleccione Usuario"
          }
          className="m-5"
          variant="warning"
          type="submit"
        >
          Cambiar de Agencia
        </Button>
      </Form>
      {loading && <Loader />}
    </div>
  );
}
