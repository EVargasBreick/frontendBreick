import React, { useEffect, useState } from "react";
import "../styles/formLayouts.css";
import { Button, Form, Table } from "react-bootstrap";
import { Loader } from "./loader/Loader";
import { generateExcel } from "../services/utils";
import { salesBySellerReport } from "../services/reportServices";

export default function FormSalesSeller() {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [hourStart, setHourStart] = useState("");
  const [hourEnd, setHourEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const reportData = await salesBySellerReport(
        dateStart,
        dateEnd,
        hourStart,
        hourEnd
      );
      console.log("Reporte data", reportData);
      setReports(reportData.data);
      setLoading(false);
    } catch (err) {}
  }
  useEffect(() => {
    if (dateStart != dateEnd) {
      setHourStart("");
      setHourEnd("");
    }
  }, [dateStart, dateEnd]);

  const rows = reports.map((report, index) => (
    <tr key={index} className="tableRow">
      <td className="tableColumnSmall">{report.nombreVendedor}</td>
      <td className="tableColumnSmall">{report.totalFacturado}</td>
      <td className="tableColumnSmall">{report.totalAnulado}</td>
    </tr>
  ));

  return (
    <section>
      <p className="formLabel">REPORTE DE VENTAS POR VENDEDOR</p>
      <Form
        className="d-flex justify-content-center p-3 flex-column gap-3"
        onSubmit={handleSubmit}
      >
        <Form.Label>Seleccione rango de fechas</Form.Label>
        <div className="d-xl-flex justify-content-center gap-3">
          <Form.Group className="flex-grow-1" controlId="dateField1">
            <Form.Label>Fecha Inicio:</Form.Label>
            <Form.Control
              type="date"
              value={dateStart}
              required
              onChange={(e) => setDateStart(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="flex-grow-1" controlId="dateField2">
            <Form.Label>Fecha Fin:</Form.Label>
            <Form.Control
              type="date"
              value={dateEnd}
              required
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </Form.Group>
        </div>
        {dateEnd == dateStart ? (
          <div className="d-xl-flex justify-content-center gap-3">
            <Form.Group className="flex-grow-1" controlId="dateField1">
              <Form.Label>Hora Inicio:</Form.Label>
              <Form.Control
                type="time"
                value={hourStart}
                required
                onChange={(e) => setHourStart(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex-grow-1" controlId="dateField2">
              <Form.Label>Hora Fin:</Form.Label>
              <Form.Control
                type="time"
                value={hourEnd}
                required
                onChange={(e) => setHourEnd(e.target.value)}
              />
            </Form.Group>
          </div>
        ) : null}

        <div>
          <Button className="flex-grow-1" variant="warning" type="submit">
            Generar Reporte
          </Button>
        </div>
      </Form>

      <div className="d-flex justify-content-center">
        <div className="tableOne">
          <Table striped bordered responsive>
            <thead>
              <tr className="tableHeader">
                <th className="tableColumn">Vendedor</th>
                <th className="tableColumn">Total Facturado</th>
                <th className="tableColumn">Total Anulado</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </div>
      {reports.length > 0 && (
        <Button
          variant="success"
          onClick={() => {
            generateExcel(
              reports,
              `Reporte de Ventas por vendedor entre: ${dateStart} ${hourStart} - ${dateEnd} ${hourEnd}`
            );
          }}
        >
          Exportar a excel
        </Button>
      )}
      {loading && <Loader />}
    </section>
  );
}
