import React, { useState, useEffect } from "react";
import { Button, Modal, Image, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../styles/tableStyles.css";
import "../styles/generalStyle.css";
import loading2 from "../assets/loading2.gif";
import { getOnlyStores } from "../services/storeServices";
import { getPacks } from "../services/packServices";

export default function FormAsignPack() {
  // Listas cargadas en render
  const [agencias, setAgencias] = useState();
  const [packs, setPacks] = useState();
  // Listas y valores cargados manualmente
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPack, setTotalPack] = useState(0);
  const [nombrePack, setNombrePack] = useState("");
  // Validadores de estado
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  useEffect(() => {
    const ag = getOnlyStores();
    ag.then((age) => {
      console.log("Agencias cargadas", age.data[0]);
    });
    const packList = getPacks();
    packList
      .then((res) => {
        console.log("Pcks", res.data);
      })
      .catch((err) => {
        console.log("Error al cargar", err);
      });
  }, []);

  const handleClose = () => {
    setIsAlert(false);
    setIsAlertSec(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="formLabel">CREAR PACKS BREICK</div>
      <div className="formLabelAlt">Agregar Productos</div>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
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
      <Form></Form>
    </div>
  );
}
