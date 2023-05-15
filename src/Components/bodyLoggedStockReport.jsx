import React, { useEffect, useState } from "react";
import { getAllStores } from "../services/storeServices";
import { getStockCodes, getStockLogged } from "../services/stockServices";
import { Button, Form, Table } from "react-bootstrap";

export default function BodyLoggedStockReport() {
  useEffect(() => {
    const allStores = getAllStores();
    allStores.then((res) => {
      setStoreList(res.data);
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
  const [filtered, setFiltered] = useState("");
  const handleStore = (value) => {
    setSelectedStore(value);
  };
  const getReport = () => {
    console.log(fromDate, toDate, selectedStore);
    const dataReport = getStockLogged({
      idAgencia: selectedStore,
      fromDate,
      toDate,
    });
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
        ad.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        ad.codInterno.includes(value)
    );
    setTableData(filtered);
  };
  return (
    <div>
      <div className="formLabel">REPORTE DE MOVIMIENTOS DE KARDEX</div>
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
            <Form.Label>Filtrar por producto</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => filter(e.target.value)}
            />
          </Form>
          <div className="formLabel">Reporte de movimientos</div>
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
            <Table>
              <thead>
                <tr
                  style={{ position: "sticky", top: 0 }}
                  className="tableHeaderReport"
                >
                  <th>Cod Interno</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Tipo</th>
                  <th>Detalle</th>
                  <th>Id</th>
                  <th>Fecha - Hora</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((td, index) => {
                  const codigo = td.detalle.split("-")[0];
                  const id = td.detalle.split("-")[1];
                  return (
                    <tr key={index} className="tableBodyReport">
                      <td>{td.codInterno}</td>
                      <td>{td.nombreProducto}</td>
                      <td>{td.cantidadProducto}</td>
                      <td>{td.accion === "+" ? "Ingreso" : "Salida"}</td>
                      <td>
                        {
                          codeList.find((cl) => cl.codigo === codigo)
                            .descripcion
                        }
                      </td>
                      <td>{id}</td>
                      <td>{td.fechaHora}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
