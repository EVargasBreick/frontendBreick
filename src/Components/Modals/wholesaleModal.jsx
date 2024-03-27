import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { userService } from "../../services/userServices";
import { Loader } from "../loader/Loader";
import Cookies from "js-cookie";

export const WholeSaleModal = ({ sudoId, showModal }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getWholeUsers() {
      const userList = await userService.getAll("3,13");
      const filtered = userList.filter(
        (ul) => ul.rol == 3 || ul.idUsuario == sudoId
      );
      setUserList(filtered);
      console.log("Filtered", filtered);
    }
    getWholeUsers();
  }, []);

  const handleSelection = (value) => {
    setLoading(true);
    const found = userList.find((ul) => ul.idUsuario == value);
    Cookies.set("selectedwhole", JSON.stringify(found), { expires: 0.5 });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Modal show={showModal}>
      <Modal.Header>Usuario mayorista para creación de pedido</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Select onChange={(e) => handleSelection(e.target.value)}>
            <option>Seleccione usuario</option>
            {userList.map((ul, index) => {
              return (
                <option
                  key={index}
                  value={ul.idUsuario}
                >{`${ul.nombre} ${ul.apPaterno} ${ul.apMaterno}`}</option>
              );
            })}
          </Form.Select>
        </Form>
      </Modal.Body>
      {loading && <Loader />}
    </Modal>
  );
};
