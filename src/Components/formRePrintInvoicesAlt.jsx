import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Modal, Table, Spinner } from "react-bootstrap";
import { emizorService } from "../services/emizorService";
import { Loader } from "./loader/Loader";
import Cookies from "js-cookie";

export default function FormRePrintInvoicesAlt() {
  const [nit, setNit] = useState("");
  const [nitError, setNitError] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [facturasAux, setFacturasAux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [userStore, setUserStore] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    const parsedUser = JSON.parse(UsuarioAct);
    if (parsedUser) {
      const sudStore = Cookies.get("sudostore");
      if (sudStore) {
        setUserStore(sudStore);
      } else {
        setUserStore(parsedUser.idAlmacen);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nit.trim() === "") {
      setNitError("NIT es requerido");
    } else {
      setLoading(true);
      console.log("nit: ", nit);
      emizorService
        .getFacturas(nit, userStore, dateEnd)
        .then((response) => {
          console.log("response: ", response);
          setFacturas(response.data);
          setFacturasAux(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log("error: ", error);
        });
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
    setFacturas([]);
    setFacturasAux([]);
    setInvoiceNumber("");
  };

  const handleNumberSearch = (value) => {
    setInvoiceNumber(value);
    const filtered = facturasAux.filter((fa) => fa.nroFactura.includes(value));
    setFacturas(filtered);
  };

  const rows = facturas.map((factura, index) => (
    <tr key={index} className="tableRow">
      <td className="tableColumnSmall">{factura.nroFactura}</td>
      <td className="tableColumnSmall">{factura.razonSocial}</td>
      <td className="tableColumnSmall">{factura.nitCliente}</td>
      <td className="tableColumnSmall">{factura.fechaHora}</td>
      <td className="tableColumnSmall">{factura.importeBase} Bs.</td>
      <td className="tableColumnSmall">
        <Button
          onClick={async () => {
            try {
              await setLoading(true);
              console.log("factura: ", factura);
              await emizorService.downloadFactura(
                factura.cufd,
                `${factura.nitCliente}-${factura.razonSocial}`
              );
            } catch (error) {
              console.log("error: ", error);
            } finally {
              setLoading(false);
            }
          }}
          className="yellow"
          variant="warning"
        >
          Reimprimir factura
        </Button>
      </td>
    </tr>
  ));

  return (
    <div>
      <div>
        <div className="formLabel">RE-IMPRIMIR FACTURAS</div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nitField">
            <Form.Label>NIT Cliente:</Form.Label>
            <Form.Control
              type="text"
              placeholder="nit"
              value={nit}
              onChange={handleNitChange}
              isInvalid={nitError.length > 0}
            />
            <Form.Control.Feedback type="invalid">
              {nitError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form>
            <div className="d-xl-flex justify-content-center p-3">
              <Form.Group className="p-2" controlId="dateField1">
                <Form.Label>Fecha:</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="1818915"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </Form.Group>
            </div>
          </Form>

          <div className="d-flex justify-content-around p-3">
            <Button type="submit" variant="success">
              Buscar Factura(s)
            </Button>
            <Button
              type="reset"
              variant="warning"
              onClick={(e) => clearData(e)}
            >
              Limpiar búsqueda
            </Button>
          </div>
        </Form>
      </div>
      {facturasAux.length > 0 && (
        <div>
          <Form>
            <Form.Label>Buscar por número de factura</Form.Label>
            <Form.Control
              type="number"
              value={invoiceNumber}
              onChange={(e) => handleNumberSearch(e.target.value)}
            />
          </Form>
        </div>
      )}

      {rows.length > 0 && (
        <div className="d-flex justify-content-center">
          <div className="tableOne">
            <Table striped bordered responsive>
              <thead>
                <tr className="tableHeader">
                  <th className="tableColumn">Numero Factura</th>
                  <th className="tableColumn">Razon Social</th>
                  <th className="tableColumn">Nit Cliente</th>
                  <th className="tableColumn">Fecha</th>
                  <th className="tableColumn">Monto</th>
                  <th className="tableColumn">Acciones</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
        </div>
      )}

      {loading && <Loader />}
    </div>
  );
}
