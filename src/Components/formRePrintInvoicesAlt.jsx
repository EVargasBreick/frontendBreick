import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Modal, Table, Spinner } from "react-bootstrap";
import { emizorService } from "../services/emizorService";
import { Loader } from "./loader/Loader";
export default function FormRePrintInvoicesAlt() {
  const [nit, setNit] = useState("");
  const [nitError, setNitError] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [facturasAux, setFacturasAux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (dateStart && dateEnd) {
      const filtered = facturasAux.filter((fact) => {
        var dateString = fact.fechaHora;
        var dateParts = dateString.split(" ");
        var date = dateParts[0].split("/");
        var day = parseInt(date[0], 10);
        var month = parseInt(date[1], 10) - 1; // Month is zero-based
        var year = parseInt(date[2], 10);
        // Create the Date object
        var date = new Date(year, month, day);
        const startDateParts = dateStart.split("-");
        const startDate = new Date(
          startDateParts[0],
          startDateParts[1] - 1,
          startDateParts[2]
        );
        const endDateParts = dateEnd.split("-");
        const endDate = new Date(
          endDateParts[0],
          endDateParts[1] - 1,
          endDateParts[2]
        );
        console.log("startDate: ", startDate);
        console.log("endDate: ", endDate);
        console.log("date: ", date);
        return date >= startDate && date <= endDate;
      });
      setFacturas(filtered);
    } else {
      setFacturas(rows);
    }
  }, [dateStart, dateEnd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nit.trim() === "") {
      setNitError("NIT es requerido");
    } else {
      setLoading(true);

      console.log("nit: ", nit);
      emizorService
        .getFacturas(nit)
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
    setDateStart("");
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
        {/* FORM if rows show filter dates */}
        {(rows.length > 0 || (dateEnd && dateStart)) && (
          <Form>
            <div className="d-xl-flex justify-content-center p-3">
              <Form.Group className="p-2" controlId="dateField1">
                <Form.Label>Fecha Inicio:</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="1818915"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="p-2" controlId="dateField2">
                <Form.Label>Fecha Fin:</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="1818915"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </Form.Group>
            </div>
          </Form>
        )}
      </div>

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
      {loading && <Loader />}
    </div>
  );
}
