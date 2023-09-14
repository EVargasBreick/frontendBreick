import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Modal, Table, Spinner } from "react-bootstrap";
import { emizorService } from "../services/emizorService";
import { Loader } from "./loader/Loader";
import { ConfirmModal } from "./Modals/confirmModal";
import { set } from "lodash";
export default function FormFacturasInfo() {
  const [nit, setNit] = useState("");
  const [nitError, setNitError] = useState("");
  const [dateStartError, setDateStartError] = useState("");
  const [dateEndError, setDateEndError] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [facturasAux, setFacturasAux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [showModal, setShowModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(<></>);

  useEffect(() => {
    filterDates(facturasAux);
  }, [dateStart, dateEnd]);

  function filterDates(facturasList) {
    if (dateStart && dateEnd) {
      const filtered = facturasList.filter((fact) => {
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
        return date >= startDate && date <= endDate;
      });
      setFacturas(filtered);
    } else {
      setFacturas(rows);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nit) {
      setNitError("Ingrese un NIT");
      return;
    }
    if (!dateStart) {
      setDateStartError("Ingrese una fecha de inicio");
      return;
    }
    if (!dateEnd) {
      setDateEndError("Ingrese una fecha de fin");
      return;
    }
    setLoading(true);
    emizorService
      .getFacturas(nit)
      .then((response) => {
        filterDates(response.data);
        setFacturasAux(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error: ", error);
      });
  };

  const handleNitChange = (e) => {
    setNit(e.target.value);
    setNitError("");
  };

  const clearData = (e) => {
    e.preventDefault();
    setNit("");
    setNitError("");
    setDateEndError("");
    setDateStartError("");
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
              const response = await emizorService.getFacturaByCuf(factura.cuf);
              setSelectedFactura(
                <div>
                  <div className="formLabel">FACTURA</div>
                  <Button
                    variant={
                      response?.data?.data?.codigoEstado?.decripcion ===
                      "ANULADA"
                        ? "danger"
                        : "success"
                    }
                    className="d-flex justify-content-center"
                  >
                    {response?.data?.data?.codigoEstado?.decripcion}
                  </Button>
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
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="tableRow">
                            <td className="tableColumnSmall">
                              {factura.nroFactura}
                            </td>
                            <td className="tableColumnSmall">
                              {factura.razonSocial}
                            </td>
                            <td className="tableColumnSmall">
                              {factura.nitCliente}
                            </td>
                            <td className="tableColumnSmall">
                              {factura.fechaHora}
                            </td>
                            <td className="tableColumnSmall">
                              {factura.importeBase} Bs.
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              );
              setShowModal(true);
            } catch (error) {
              console.log("error: ", error);
            } finally {
              setLoading(false);
            }
          }}
          variant="success"
        >
          Ver Estado
        </Button>
      </td>
    </tr>
  ));

  return (
    <>
      <ConfirmModal
        isButtons={false}
        show={showModal}
        setShow={setShowModal}
        title={`FACTURA`}
        text={selectedFactura}
        handleSubmit={() => {}}
        handleCancel={() => setShowModal(false)}
      />

      <div>
        <div className="formLabel">VER FACTURAS</div>
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
          <div className="d-xl-flex justify-content-center gap-3">
            <Form.Group className="flex-grow-1" controlId="dateField1">
              <Form.Label>Fecha Inicio:</Form.Label>
              <Form.Control
                type="date"
                placeholder="1818915"
                value={dateStart}
                onChange={(e) => {
                  setDateStart(e.target.value);
                  setDateStartError("");
                }}
                isInvalid={dateStartError.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                {dateStartError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="flex-grow-1" controlId="dateField2">
              <Form.Label>Fecha Fin:</Form.Label>
              <Form.Control
                type="date"
                placeholder="1818915"
                value={dateEnd}
                onChange={(e) => {
                  setDateEnd(e.target.value);
                  setDateEndError("");
                }}
                isInvalid={dateEndError.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                {dateEndError}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="d-flex justify-content-around p-3">
            <Button type="submit" variant="success">
              Buscar Factura(s)
            </Button>
            <Button
              type="reset"
              variant="warning"
              onClick={(e) => clearData(e)}
            >
              Ingresar Otros Datos
            </Button>
          </div>
        </Form>
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
    </>
  );
}
