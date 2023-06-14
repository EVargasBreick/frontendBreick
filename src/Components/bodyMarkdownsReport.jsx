import React, { useEffect, useState } from "react";
import "../styles/formLayouts.css";
import { Button, Form, Table } from "react-bootstrap";
import { getStores } from "../services/storeServices";
import { reportService } from "../services/reportServices";
import { Loader } from "./loader/Loader";
import { generateExcel } from "../services/utils";

export default function BodyMarkdownsReport() {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [idAgencia, setIdAgencia] = useState("");
  const [idBaja, setIdBaja] = useState("");
  const [almacen, setAlmacen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const stores = getStores();
    stores.then((store) => {
      setAlmacen(store.data);
    });
  }, []);

  useEffect(() => {
    if (((dateStart && dateEnd) || idBaja) && idAgencia) {
      setLoading(true);
      const data = reportService.getMarkdownsReport(
        idAgencia,
        dateStart,
        dateEnd,
        idBaja
      );
      data.then((data) => {
        setReports(data);
        setLoading(false);
      });
    }
  }, [dateStart, dateEnd, idBaja]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = await reportService.getMarkdownsReport(
      idAgencia,
      dateStart,
      dateEnd,
      idBaja
    );
    setReports(data);
    setLoading(false);
  }

  const rows = reports.map((report, index) => (
    <tr key={index} className="tableRow">
      <td className="tableColumnSmall">{report.idBaja}</td>
      <td className="tableColumnSmall">{report.codInterno}</td>
      <td className="tableColumnSmall">{report.nombreProducto}</td>
      <td className="tableColumnSmall">{report.cantProducto}</td>
      <td className="tableColumnSmall">{report.motivo}</td>
      <td className="tableColumnSmall">{report.fechaBaja}</td>

      {/* <td className="tableColumnSmall">
        <Button className="yellow" variant="warning">
          Ver Detalles
        </Button>
      </td> */}
    </tr>
  ));

  return (
    <section>
      <p className="formLabel">REPORTE GENERAL DE BAJAS</p>
      <Form
        className="d-flex justify-content-center p-3 flex-column gap-3"
        onSubmit={handleSubmit}
      >
        <Form.Group controlId="formSelectAgencias">
          <Form.Label>Agencia:</Form.Label>
          <Form.Control
            className="reportOptionDrop"
            as="select"
            defaultValue="Seleccione una agencia"
            onChange={(e) => setIdAgencia(e.target.value)}
          >
            <option>Seleccione una agencia</option>
            {almacen.map((agencia) => {
              return (
                <option value={agencia.idAgencia} key={agencia.idAgencia}>
                  {agencia.Nombre}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <p className="formLabel">FILTROS- NO OBLIGATORIOS</p>

        <Form.Group>
          <Form.Label>Filtrar por ID Baja</Form.Label>
          <Form.Control
            type="number"
            placeholder="ID Baja"
            value={idBaja}
            onChange={(e) => setIdBaja(e.target.value)}
          />
        </Form.Group>

        <Form.Label>Seleccione rango de fechas</Form.Label>
        <div className="d-xl-flex justify-content-center gap-3">
          <Form.Group className="flex-grow-1" controlId="dateField1">
            <Form.Label>Fecha Inicio:</Form.Label>
            <Form.Control
              type="date"
              placeholder="1818915"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="flex-grow-1" controlId="dateField2">
            <Form.Label>Fecha Fin:</Form.Label>
            <Form.Control
              type="date"
              placeholder="1818915"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </Form.Group>
        </div>

        <Button className="reportButton " variant="success" type="submit">
          Generar Reporte
        </Button>
      </Form>

      {reports.length > 0 && (
        <Button
          variant="success"
          onClick={() => {
            generateExcel(
              reports,
              `Reporte de Bajas ${dateStart} - ${dateEnd}`
            );
          }}
        >
          Exportar a excel
        </Button>
      )}

      <div className="d-flex justify-content-center">
        <div className="tableOne">
          <Table striped bordered responsive>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumn">ID Baja</th>
                <th className="tableColumn">Codigo Interno</th>
                <th className="tableColumn">Nombre del Producto</th>
                <th className="tableColumn">Cantidad del Producto</th>
                <th className="tableColumn">Motivo</th>
                <th className="tableColumn">Fecha de Baja</th>
                {/* <th className="tableColumn">Acciones</th> */}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </div>
      {loading && <Loader />}
    </section>
  );
}