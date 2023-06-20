import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { getStores } from "../services/storeServices";
import { Loader } from "./loader/Loader";
import { userService } from "../services/userServices";
import { set } from "lodash";
export default function FormEditUserAgnecy() {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [actualAgency, setActualAgency] = useState("");
  const [usuario, setUsuario] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const stores = getStores();
    stores.then((store) => {
      setAgencies(store.data);
      setLoading(false);
    });

    const users = userService.getAll("4,2");
    users.then((users) => {
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    const user = userService.findUser(usuario);
    user.then((user) => {
      if (user) {
        setSelectedAgency(user.idAlmacen);
        setSelectedUser(user.idUsuario);
        setActualAgency(user.idAlmacen);
      }
    });
  }, [usuario]);

  return (
    <div>
      <div className="formLabel">EDITAR AGENCIA DE USUARIO</div>
      <Form>
        <div className="d-xl-flex justify-content-center gap-3">
          <Form.Group className="flex-grow-1">
            <Form.Label>Seleccionar Usuario</Form.Label>
            <Form.Select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setUsuario(
                  users.find((user) => user.idUsuario == e.target.value).nombre
                );
              }}
            >
              <option>Seleccione Usuario</option>
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
            <Form.Label>Buscar Usuario</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Buscar Usuario"
            />
          </Form.Group>
        </div>

        <div className="formLabel">
          EL USUARIO ACTUAL ESTA EN:{" "}
          {agencies.find((ag) => ag.idAgencia == actualAgency).Nombre}
        </div>

        <Form.Group>
          <Form.Label>Agencia</Form.Label>
          <Form.Select
            value={selectedAgency}
            onChange={(e) => {
              setSelectedAgency(e.target.value);
            }}
          >
            <option>Seleccione Agencia</option>
            {agencies.map((ag) => {
              return (
                <option value={ag.idAgencia} key={ag.idAgencia}>
                  {ag.Nombre}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </Form>

      {loading && <Loader />}
    </div>
  );
}
