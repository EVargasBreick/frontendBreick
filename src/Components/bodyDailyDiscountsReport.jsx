import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { dailyDiscountReport } from "../services/reportServices";

export default function BodyDailyDiscountsReport() {
  const [date, setDate] = useState("");
  const [fullData, setFullData] = useState([]);
  const [fDate, setFDate] = useState("");
  const [detailsData, setDetailsData] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [filteredDetails, setFilteredDetails] = useState([]);

  async function getReport(e) {
    e.preventDefault();
    try {
      const reportData = await dailyDiscountReport(date);
      console.log("Data del reporte", reportData);
      setFullData(reportData.data.general);
      setDetailsData(reportData.data.details);
    } catch (error) {
      console.log("Error al obtener reporte", error);
    }
  }

  useEffect(() => {
    if (date != "") {
      const parts = date.split("-");
      const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      console.log("Parts", formattedDate);
      setFDate(formattedDate);
    }
  }, [date]);

  function viewDetails(id) {
    const filtered = detailsData
      .filter((dd) => dd.idUsuarioCrea == id)
      .sort((a, b) => b.idFactura - a.idFactura);
    console.log("Filtered details", filtered);
    setFilteredDetails(filtered);
    setIsModal(true);
  }

  function goToSiat(cuf, nroFactura) {
    const url = `https://siat.impuestos.gob.bo/consulta/QR?nit=128153028&cuf=${cuf}&numero=${nroFactura}`;
    window.open(url, "_blank");
  }

  function handleClose() {
    setFilteredDetails([]);
    setIsModal(false);
  }

  const DetailsModal = () => {
    return (
      <Modal show={isModal} size="xl">
        <Modal.Header
          style={{
            color: "white",
            backgroundColor: "#5cb8b2",
            textAlign: "center",
          }}
        >{`Detalles de ventas de ${filteredDetails[0]?.nombre_completo?.toUpperCase()} - ${filteredDetails[0]?.usuario?.toUpperCase()} en ${fDate}`}</Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr className="tableHeader">
                <th>Nit</th>
                <th style={{ width: "12%" }}>Razon Social</th>
                <th>Hora</th>
                <th>Nro Factura</th>
                <th>Monto Total</th>
                <th style={{ width: "11%" }}>Descuento %</th>
                <th>Descuento en Monto</th>
                <th>Facturado</th>
                <th>Ver Factura</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((fd, index) => {
                const onlyHour = fd.fechaHora.split(" ")[1];
                return (
                  <tr key={index} className="tableRow">
                    <td>{fd.nitCliente}</td>
                    <td>{fd.razonSocial}</td>
                    <td>{onlyHour}</td>
                    <td>{fd.nroFactura}</td>
                    <td>{`${fd.montoTotal?.toFixed(2)} Bs`}</td>
                    <td>{fd.descuento}</td>
                    <td>{`${fd.descuentoCalculado?.toFixed(2)} Bs`}</td>
                    <td>{`${fd.importeBase?.toFixed(2)} Bs`}</td>
                    <td>
                      {
                        <Button
                          onClick={() => goToSiat(fd.cuf, fd.nroFactura)}
                          variant="success"
                        >
                          {" "}
                          Ver
                        </Button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleClose()} variant="danger">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <div className="formLabel">
        REPORTE DE DESCUENTOS DIARIOS POR VENDEDOR
      </div>
      <div className="formLabel">Seleccione fecha del reporte</div>
      {isModal && <DetailsModal />}

      <Form
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
        onSubmit={(e) => getReport(e)}
      >
        <Form.Group style={{ width: "50%" }}>
          <Form.Label>Fecha</Form.Label>
          <Form.Control type="date" onChange={(e) => setDate(e.target.value)} />
          {date != "" && (
            <Button
              type="submit"
              style={{ width: "50%", margin: "15px" }}
              variant="success"
            >
              Generar reporte
            </Button>
          )}
        </Form.Group>
      </Form>
      {fullData.length > 0 && (
        <Table>
          <thead className="tableHeader">
            <tr>
              <th
                colSpan={5}
                style={{ textAlign: "center" }}
              >{`Reporte diario de descuentos en ${fDate}`}</th>
            </tr>
            <tr style={{ textAlign: "center" }}>
              <th>Nombre</th>
              <th>Vendedor</th>
              <th>Nro de ventas con descuento</th>
              <th>Total monto descontado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {fullData.map((fd, index) => {
              return (
                <tr key={index} className="tableRow">
                  <td style={{ textAlign: "left", width: "20%" }}>
                    {fd.nombre_completo}
                  </td>
                  <td style={{ textAlign: "left", width: "20%" }}>
                    {fd.usuario}
                  </td>
                  <td style={{ textAlign: "center", width: "20%" }}>
                    {fd.count}
                  </td>
                  <td style={{ textAlign: "right", width: "20%" }}>
                    {`${fd.sum?.toFixed(2)} Bs. `}
                  </td>
                  <td style={{ textAlign: "center", width: "15%" }}>
                    <Button
                      variant="warning"
                      onClick={() => viewDetails(fd.idUsuarioCrea)}
                    >
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
