import React, { useEffect, useState } from "react";
import { getAllStores } from "../services/storeServices";
import { getStockCodes, getStockLogged } from "../services/stockServices";
import { Button, Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { generateExcel } from "../services/utils";
import { Loader } from "./loader/Loader";
export default function BodyLoggedStockReport() {
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
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const handleStore = (value) => {
    setSelectedStore(value);
  };
  const getReport = () => {
    setLoading(true);
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
      setLoading(false);
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

  function ExportStockReport() {
    var array = [];
    for (const entry of tableData) {
      const codigo = entry.detalle.split("-")[0];
      const id = entry.detalle.split("-")[1];
      const obj = {
        ["Cod Interno"]: entry.codInterno,
        Producto: entry.nombreProducto,
        Cantidad: entry.cantidadProducto,
        Tipo: entry.accion === "+" ? "Ingreso" : "Salida",
        Detalle: codeList.find((cl) => cl.codigo === codigo).descripcion,
        Id: id,
        ["Fecha - Hora"]: entry.fechaHora,
        Entrada: entry.accion === "+" ? entry.cantidadProducto : 0,
        Salida: entry.accion === "-" ? entry.cantidadProducto : 0,
      };
      array.push(obj);
    }
    const newEntry = {
      ["Cod Interno"]: "",
      Producto: "",
      Cantidad: "",
      Tipo: "",
      Detalle: "",
      Id: "",
      ["Fecha - Hora"]: "Totales",
      Entrada: array.reduce((accumulator, object) => {
        return accumulator + parseFloat(object.Entrada);
      }, 0),
      Salida: array.reduce((accumulator, object) => {
        return accumulator + parseFloat(object.Salida);
      }, 0),
      Diferencia:
        array.reduce((accumulator, object) => {
          return accumulator + parseFloat(object.Entrada);
        }, 0) -
        array.reduce((accumulator, object) => {
          return accumulator + parseFloat(object.Salida);
        }, 0),
    };
    array.push(newEntry);
    const storeName = storeList.find(
      (sl) => sl.idagencia === selectedStore
    ).nombre;
    return new Promise((resolve) => {
      var ws_data = array;
      var ws = XLSX.utils.json_to_sheet(ws_data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Detalle reporte`);
      XLSX.writeFile(
        wb,
        `Reporte movimiento de kardex de ${fromDate} a ${toDate}' de ${storeName} con filtro ${filtered}.xlsx`
      );
      resolve(true);
    });
  }

  const filterById = (value) => {
    console.log("Aux data table", auxTableData);
    setSearchId(value);
    const filtered = auxTableData.filter(
      (ad) => ad.detalle.split("-").pop() == value
    );
    console.log("FIltered", filtered);
    if (filtered.length > 0) {
      setTableData(filtered);
    } else {
      setTableData(auxTableData);
    }
  };

  function exportUpdateSqlData() {
    const toExport = [];
    for (const entry of tableData) {
      const row = {
        idProducto: entry.idProducto,
        codInterno: entry.codInterno,
        nombreProducto: entry.nombreProducto,
        cantidad: entry.cantidadProducto,
        accion: entry.accion,
        queryAg: `update stock_agencia set "cant_Actual"="cant_Actual"${entry.accion}${entry.cantidadProducto} where "idProducto"=${entry.idProducto} and "idAgencia"='${selectedStore}';`,
        queryBodega: `update stock_bodega set "cant_Actual"="cant_Actual"${entry.accion}${entry.cantidadProducto} where "idProducto"=${entry.idProducto} and "idBodega"='${selectedStore}';`,
        queryMovil: `update stock_agencia_movil set "cant_Actual"="cant_Actual"${entry.accion}${entry.cantidadProducto} where "idProducto"=${entry.idProducto} and "idVehiculo"='${selectedStore}';`,
      };
      toExport.push(row);
    }
    generateExcel(toExport, `Plantilla nivelacion ${selectedStore}`);
  }

  return (
    <div>
      {loading && <Loader />}
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
              value={filtered}
            />
          </Form>
          <Form style={{ marginTop: "10px" }}>
            <Form.Label>
              Filtrar por id de Pedido / Traspaso / Baja / Nro de factura
            </Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => filterById(e.target.value)}
              value={searchId}
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
                  <th>Id/Nro Factura</th>
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
                        {codeList.find((cl) => cl.codigo === codigo)
                          ?.descripcion
                          ? codeList.find((cl) => cl.codigo === codigo)
                              .descripcion
                          : "Descripción no disponible"}
                      </td>
                      <td>{id}</td>
                      <td>{td.fechaHora}</td>
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
                ExportStockReport();
              }}
            >
              Exportar a excel
            </Button>
          </div>
          {isSudo ? (
            <div style={{ paddingTop: "5%" }}>
              <Button
                variant="info"
                className="cyanLarge"
                onClick={() => {
                  exportUpdateSqlData();
                }}
              >
                Exportar a excel para nivelacion
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
