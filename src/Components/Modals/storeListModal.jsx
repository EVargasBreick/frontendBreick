import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import { getOnlyStores } from "../../services/storeServices";
export const StoreListModal = ({
  sudoStoreSelected,
  show,
  handleSelection,
}) => {
  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    const sList = getOnlyStores();
    sList.then((stores) => {
      console.log("STORE LIST", stores.data);
      setStoreList(stores.data);
    });
  }, []);

  return (
    <Modal show={!show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>{`Seleccione Agencia`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Select
            onChange={(e) => handleSelection(e.target.value)}
            value={sudoStoreSelected}
          >
            <option>Seleccione Agencia para facturación</option>
            {storeList.map((sl, index) => {
              return (
                <option key={index} value={sl.idAgencia}>
                  {sl.Nombre}
                </option>
              );
            })}
          </Form.Select>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
