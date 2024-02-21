import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { getAllStores } from "../services/storeServices";
import { Loader } from "./loader/Loader";
import Cookies from "js-cookie";
import { canceledInvoicesReport } from "../services/reportServices";

export default function BodyCanceledInvoicesReport() {
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isReport, setIsReport] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStore = (value) => {
    setSelectedStore(value);
  };

  useEffect(() => {
    const sudos = [1, 8, 10, 9, 7, 12];
    const userRol = JSON.parse(Cookies.get("userAuth")).rol;
    const allStores = getAllStores();
    allStores.then((res) => {
      console.log("Agencias", res.data);
      if (sudos.includes(userRol)) {
        console.log("Todas las tiendas");
        setStoreList(res.data);
      } else {
        console.log("Filtrado");
        const store = JSON.parse(Cookies.get("userAuth")).idAlmacen;
        const filtered = res.data.find((st) => st.idagencia == store);
        console.log("Filtered", filtered);
        setStoreList([filtered]);
      }
    });
  }, []);

  const getReport = () => {
    setLoading(true);
    console.log(fromDate, toDate, selectedStore);
    const dataReport = canceledInvoicesReport({
      fromDate,
      toDate,
      idAgencia: selectedStore,
    });
    dataReport.then((res) => {
      console.log("Data", res);
      setTableData(res.data);
      setIsReport(true);
      setLoading(false);
    });
  };

  function goToSiat(cuf, nroFactura) {
    const url = `https://siat.impuestos.gob.bo/consulta/QR?nit=128153028&cuf=${cuf}&numero=${nroFactura}`;
    window.open(url, "_blank");
  }

  return (
    <div>
      <div>
        {loading && <Loader />}
        <div className="formLabel">REPORTE DE FACTURAS ANULADAS</div>
        <div className="formLabel">Seleccione rango de fechas</div>
        <Form style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Form.Group style={{ width: "30%" }}>
            <Form.Label>Desde</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group style={{ width: "30%" }}>
            <Form.Label>Hasta</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group style={{ width: "30%" }}>
            <Form.Label>Agencia</Form.Label>
            <Form.Select onChange={(e) => handleStore(e.target.value)}>
              <option>Seleccione Agencia</option>
              {storeList.map((sl, index) => {
                return (
                  <option key={index} value={sl.idagencia}>
                    {sl.nombre}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Form>
      </div>
      {selectedStore != "" && fromDate != "" && toDate != "" ? (
        <div style={{ margin: "50px" }}>
          <Button
            variant="warning"
            className="yellowLarge"
            onClick={() => getReport()}
          >
            Generar Reporte
          </Button>
        </div>
      ) : (
        <div style={{ margin: "30px" }}>
          <div>Seleccione rango de fechas y agencia</div>
        </div>
      )}
      {isReport && (
        <Table>
          <thead>
            <tr className="tableHeader">
              <th colSpan={7} style={{ textAlign: "center" }}>
                Facturas anuladas en el rango seleccionado
              </th>
            </tr>
            <tr className="tableHeader">
              <th>Nro Factura</th>
              <th>Nit Cliente</th>
              <th>Razón Social</th>
              <th>Importe</th>
              <th>Fecha Emisión</th>
              <th>Fecha Anulación</th>
              <th>Ver en Siat</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((td, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td>{td.nroFactura}</td>
                    <td>{td.nitCliente}</td>
                    <td>{td.razonSocial}</td>
                    <td>{`${td.importeBase?.toFixed(2)} Bs`}</td>
                    <td>{td.fechaHora}</td>
                    <td>{td.fechaAnulacion}</td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        variant="warning"
                        onClick={() => goToSiat(td.cuf, td.nroFactura)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="tableRow">
                <th colSpan={7}>
                  No existen facturas anuladas en este periodo
                </th>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}
