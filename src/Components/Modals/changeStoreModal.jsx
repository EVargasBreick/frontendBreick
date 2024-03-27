import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getAllStores } from "../../services/storeServices";
import Cookies from "js-cookie";
import { Loader } from "../loader/Loader";
export default function ChangeStoreModal({ isChangeStore, setIsChangeStore }) {
  const [storeList, setStoreList] = useState([]);
  const [userRol, setUserRol] = useState("");
  const [currentSudo, setCurrentSudo] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [newStore, setNewStore] = useState("");
  const [loading, setLoading] = useState(false);
  //[1, 9, 7, 8, 12].includes(parsedUser.rol);
  useEffect(() => {
    const cSudo = Cookies.get("sudostore");
    if (cSudo) {
      setCurrentSudo(cSudo);
    }
    const user = Cookies.get("userAuth");
    if (user) {
      const parsed = JSON.parse(user);
      setUserRol(parsed.rol);
    }
    async function getStoresFull() {
      try {
        const list = await getAllStores();
        setStoreList(list.data);
        console.log("AGENCIAS TODAS", list.data);
        if (cSudo) {
          const foundName = list.data.find(
            (dl) => dl.idagencia == cSudo
          )?.nombre;
          setCurrentName(foundName);
        }
      } catch (error) {
        console.log("Error al fetchear tiendas", error);
      }
    }
    getStoresFull();
  }, []);

  const changeStore = () => {
    setLoading(true);
    Cookies.set("sudostore", newStore, { expires: 0.5 });
    Cookies.remove("pdv");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Modal show={isChangeStore}>
      <Modal.Header>Cambiar agencia / Almacen</Modal.Header>
      <Modal.Body>
        {[1, 9, 7, 8, 12].includes(userRol) ? (
          <Form>
            <Form.Select onChange={(e) => setNewStore(e.target.value)}>
              {currentSudo == "" ? (
                <option>Seleccione agencia</option>
              ) : (
                <option value={currentSudo}>{currentName}</option>
              )}
              {storeList.map((sl, index) => {
                if (
                  sl.idagencia != currentSudo &&
                  !sl.idagencia.includes("-")
                ) {
                  return (
                    <option value={sl.idagencia} key={index}>
                      {sl.nombre}
                    </option>
                  );
                }
              })}
            </Form.Select>
          </Form>
        ) : (
          <div>SU USUARIO NO PUEDE CAMBIAR DE AGENCIA</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          {[1, 9, 7, 8, 12].includes(userRol) && (
            <Button onClick={() => changeStore()} variant="success">
              Guardar
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => {
              {
                setCurrentName("");
                setCurrentSudo("");
                setIsChangeStore(false);
              }
            }}
          >
            Cancelar
          </Button>
        </div>
      </Modal.Footer>
      {loading && <Loader />}
    </Modal>
  );
}
