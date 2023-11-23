import React, { useEffect, useState } from "react";
import "../styles/formLayouts.css";
import { Button, Form, Table } from "react-bootstrap";
import { Loader } from "./loader/Loader";
import { generateExcel } from "../services/utils";
import {
  getSalesByStoreReport,
  salesBySellerReport,
} from "../services/reportServices";

export default function FormTraspasosCantidadAgencias() {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const reportData = await getSalesByStoreReport(dateStart, dateEnd);
      console.log("Data del reporte", reportData.data);
      setReports(reportData.data);
      setLoading(false);
    } catch (err) {}
  }

  const exportData = [];

  const emapaId = reports.find(
    (item) => item.destination_name === "Almacen Emapa"
  )?.idDestino;
  const filteredReports = reports.filter((item) => item.idDestino !== emapaId);
  const destinations = [
    ...new Set(filteredReports.map((item) => item.destination_name)),
  ];
  const productNames = [
    ...new Set(filteredReports.map((item) => item.nombreProducto)),
  ];

  useEffect(() => {
    productNames.forEach((product) => {
      const productData = {
        codInterno: filteredReports.find((fr) => fr.nombreProducto == product)
          ?.codInterno,
        productName: product,
      };
      destinations.forEach((destination) => {
        const matchingItem = filteredReports.find(
          (item) =>
            item.nombreProducto === product &&
            item.destination_name === destination
        );
        productData[destination] = matchingItem
          ? matchingItem.product_count
          : "--";
      });
      exportData.push(productData);
    });
  }, [reports]);

  const rows = productNames.map((product) => (
    <tr key={product} className="tableRow">
      <td>
        {filteredReports.find((fr) => fr.nombreProducto == product)?.codInterno}
      </td>
      <td>{product}</td>

      {destinations.map((destination) => {
        const matchingItem = filteredReports.find(
          (item) =>
            item.nombreProducto === product &&
            item.destination_name === destination
        );
        return (
          <td key={destination}>
            {matchingItem ? matchingItem.product_count : "--"}
          </td>
        );
      })}
    </tr>
  ));

  return (
    <section>
      <p className="formLabel">REPORTE DE TRASPASOS POR AGENCIA(CANTIDAD)</p>
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
                <th>Cod Interno</th>
                <th>Nombre Producto</th>
                {destinations.map((destination) => (
                  <th key={destination}>{destination}</th>
                ))}
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
              exportData,
              `Reporte de Traspasos a Agencias: ${dateStart} - ${dateEnd}`
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
