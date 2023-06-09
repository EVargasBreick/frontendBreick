import React from "react";
import { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
export default function FormRePrintInvoicesAlt() {
  const [nit, setNit] = useState("");
  const [nitError, setNitError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nit.trim() === "") {
      setNitError("NIT es requerido");
    } else {
      console.log("nit: ", nit);
    }
  };

  const handleNitChange = (e) => {
    setNit(e.target.value);
    setNitError("");
  };

  const clearData = (e) => {
    e.preventDefault();
    setNit("");
    setNitError("");
  };

  return (
    <div>
      <div>
        <div className="formLabel">RE-IMPRIMIR FACTURAS</div>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nitField">
            <Form.Label>NIT Cliente:</Form.Label>
            <Form.Control
              type="text"
              placeholder="1818915"
              value={nit}
              onChange={handleNitChange}
              isInvalid={nitError.length > 0}
            />
            <Form.Control.Feedback type="invalid">
              {nitError}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-around p-3">
            <Button type="submit" variant="success">
              Buscar Factura(s)
            </Button>
            <Button
              type="button"
              variant="warning"
              onClick={(e) => clearData(e)}
            >
              Ingresar Otros Datos
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
