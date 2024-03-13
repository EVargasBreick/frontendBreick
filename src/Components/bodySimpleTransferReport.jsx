import React, { useEffect, useState } from "react";
import { getAllStores } from "../services/storeServices";
import { getStockCodes, getStockLogged } from "../services/stockServices";
import { Button, Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { generateExcel } from "../services/utils";
import {
  samplesReport,
  simpleTransferReport,
} from "../services/reportServices";
export default function BodySimpleTransferReport() {
  const [allSts, setAllSts] = useState([]);
  useEffect(() => {
    const sudos = [1, 8, 10, 9, 7, 12];
    const userRol = JSON.parse(Cookies.get("userAuth")).rol;
    const allStores = getAllStores();
    allStores.then((res) => {
      console.log("Agencias", res.data);
      setAllSts(res.data);
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
    const dataReport = simpleTransferReport(fromDate, toDate, selectedStore);
    dataReport.then((res) => {
      console.log("Data", res);
      setTableData(res.data);
      setAuxTableData(res.data);
      setIsReport(true);
    });
  };

  const filter = (value) => {
    setFiltered(value);
    if (value == "todo") {
      setTableData(auxTableData);
    } else {
      if (value == "0") {
        const filtered = auxTableData.filter(
          (ad) => ad.estado == 0 && ad.movil == 0
        );
        setTableData(filtered);
      } else {
        const filtered =
          value == "1"
            ? auxTableData.filter(
                (ad) => ad.estado == 1 || (ad.estado == 0 && ad.movil == 1)
              )
            : auxTableData.filter((ad) => ad.estado == "2");
        setTableData(filtered);
      }
    }
  };

  const exportToExcel = async () => {
    console.log("All stores", allSts);
    const formatedTable = [];
    for (const entry of tableData) {
      const origen = allSts.find((as) => as.idagencia == entry.idOrigen).nombre;
      const destino = allSts.find(
        (as) => as.idagencia == entry.idDestino
      ).nombre;
      const obj = {
        ["Id Traspaso"]: entry.idTraspaso,
        Origen: origen,
        Destino: destino,
        ["Fecha y hora"]: entry.fechaCrea,
        Usuario: entry.usuario,
      };
      formatedTable.push(obj);
    }
    const store = allSts.find((as) => as.idagencia == selectedStore).nombre;
    generateExcel(
      formatedTable,
      `Reporte de traspasos en ${store} ${fromDate} - ${toDate}`
    );
  };

  return (
    <div>
      <div className="formLabel">REPORTE DE SIMPLE DE TRASPASOS</div>
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
            <Form.Label>Filtrar estado</Form.Label>
            <Form.Select
              value={filtered}
              onChange={(e) => filter(e.target.value)}
            >
              <option>Seleccione estado</option>
              <option value={"todo"}>Todos</option>
              <option value={"1"}>Aprobados</option>
              <option value={"0"}>Pendientes</option>
              <option value={"2"}>Cancelados</option>
            </Form.Select>
          </Form>
          <div className="formLabel">Reporte simple de traspasos</div>
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
            <Table>
              <thead>
                <tr
                  style={{ position: "sticky", top: 0 }}
                  className="tableHeaderReport"
                >
                  <th>Id Traspaso</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((td, index) => {
                  const origen = allSts.find(
                    (as) => as.idagencia == td.idOrigen
                  )?.nombre;
                  const destino = allSts.find(
                    (as) => as.idagencia == td.idDestino
                  )?.nombre;
                  const estado =
                    td.estado == 0
                      ? td.movil == 0
                        ? "Pendiente"
                        : "Aprobado"
                      : td.estado == 1
                      ? "Aprobado"
                      : "Cancelado";
                  return (
                    <tr key={index} className="tableBodyReport">
                      <td>{td.idTraspaso}</td>
                      <td>{origen}</td>
                      <td>{destino}</td>
                      <td>{td.fechaCrea}</td>
                      <td>{estado}</td>
                      <td>{td.usuario}</td>
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