import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { getClientSimple } from "../../services/clientServices";

export default function ProductInfoModal({
  showSearchInfoModal,
  setShowSearchClientModal,
}) {
  const [search, setSearch] = useState("");
  const [clientData, setClientData] = useState({ nit: "", razonSocial: "" });

  const searchClient = async (e) => {
    e.preventDefault();
    console.log("Buscando este valor", search);
    try {
      const data = await getClientSimple(search);
      console.log("Data", data.data[0]);
      setClientData(data.data[0]);
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  function handleClose() {
    setShowSearchClientModal(false);
    setSearch("");
    setClientData({ nit: "", razonSocial: "" });
  }

  return (
    <Modal show={showSearchClientModal}>
      <Modal.Header>
        <Form style={{ width: "100%" }} onSubmit={(e) => searchClient(e)}>
          <Form.Label>{`Buscar por nit o razon social`}</Form.Label>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Control
              style={{ width: "70%" }}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={(e) => searchClient(e)} variant="success">
              Buscar
            </Button>
          </div>
        </Form>
      </Modal.Header>
      <Modal.Body hidden={clientData.nit == "" || clientData.razonSocial == ""}>
        <Table bordered>
          <thead>
            <tr className="tableHeader">
              <th colSpan={2}>DATOS DEL CLIENTE BUSCADO</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tableHeader">
              <th>Nit</th>
              <th>Razon Social</th>
            </tr>
            <tr className="tableRow">
              <td>{clientData.nit}</td>
              <td>{clientData.razonSocial}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="tableHeader">
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Button onClick={() => handleClose()} variant="warning">
            Cerrar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
