import React, { useEffect, useState } from "react";
import { getAllStores } from "../services/storeServices";
import { getStockCodes, getStockLogged } from "../services/stockServices";
import { Button, Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { generateExcel } from "../services/utils";
import {
  samplesProductReport,
  samplesReport,
} from "../services/reportServices";
export default function BodySamplesProductReport() {
  useEffect(() => {
    const sudos = [1, 8, 10, 9, 7];
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
    const codeList = getStockCodes();
    codeList.then((resp) => {
      console.log("Data", resp);
      setCodeList(resp.data);
    });
  }, []);
  const [storeList, setStoreList] = useState([]);
  const [codeList, setCodeList] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isReport, setIsReport] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [auxTableData, setAuxTableData] = useState([]);
  const isSudo = JSON.parse(Cookies.get("userAuth")).rol == 1 ? true : false;
  const [filtered, setFiltered] = useState("");
  const handleStore = (value) => {
    setSelectedStore(value);
  };
  const getReport = () => {
    const dataReport = samplesProductReport(fromDate, toDate, selectedStore);
    dataReport.then((res) => {
      console.log("Data", res);
      setTableData(res.data);
      setAuxTableData(res.data);
      setIsReport(true);
    });
  };

  const filter = (value) => {
    setFiltered(value);
    const filtered = auxTableData.filter(
      (ad) =>
        ad.cliente_razon_social.toLowerCase().includes(value.toLowerCase()) ||
        ad.ci == value
    );
    setTableData(filtered);
  };

  const exportToExcel = () => {
    generateExcel(
      tableData,
      `Reporte de productos en muestras en ${selectedStore} ${fromDate} - ${toDate}`
    );
  };

  return (
    <div>
      <div className="formLabel">REPORTE DE MUESTRAS</div>
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
      {isReport ? (
        <div>
          <Form>
            <Form.Label>Filtrar por nit/razon social</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => filter(e.target.value)}
            />
          </Form>
          <div className="formLabel">Reporte de muestras</div>
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
            <Table>
              <thead>
                <tr
                  style={{ position: "sticky", top: 0 }}
                  className="tableHeaderReport"
                >
                  <th>Id Muestra</th>
                  <th>Razon Social</th>
                  <th>Fecha</th>
                  <th>Cod Interno</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Notas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((td, index) => {
                  return (
                    <tr key={index} className="tableBodyReport">
                      <td>{td.idBaja}</td>
                      <td>{td.cliente_razon_social}</td>
                      <td>{td.fecha}</td>
                      <td>{td.codInterno}</td>
                      <td>{td.nombreProducto}</td>
                      <td>{td.cantidad}</td>
                      <td>{td.notas}</td>
                      <td>{td.estado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div style={{ paddingTop: "5%" }}>
            <Button
              variant="info"
              className="cyanLarge"
              onClick={() => {
                exportToExcel();
              }}
            >
              Exportar a excel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
