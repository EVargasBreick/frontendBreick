import React, { useEffect, useState } from "react";
import { getAllStores } from "../services/storeServices";
import { getStockCodes, getStockLogged } from "../services/stockServices";
import { Button, Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { generateExcel, generateExcelDoubleSheets } from "../services/utils";
import {
  samplesProductReport,
  samplesReport,
} from "../services/reportServices";
import { Loader } from "./loader/Loader";
//import { roundToTwoDecimalPlaces } from "../services/mathServices";
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
  const [fullTable, setFullTable] = useState({});
  const [proddList, setProddList] = useState([]);
  const [iddList, setIddList] = useState([]);
  const [reportType, setReportType] = useState(1);

  const handleStore = (value) => {
    setSelectedStore(value);
  };
  async function getReport() {
    const dataReport = samplesProductReport(fromDate, toDate, selectedStore);
    dataReport.then((res) => {
      //console.log("Data", res);
      const fullList = res.data;
      let prodList = [];
      let idList = [];
      for (const product of res.data) {
        const found = prodList.find(
          (pl) => pl?.idProducto == product.idProducto
        );
        if (!found) {
          prodList.push(product);
        }

        const foundId = idList.find((il) => il?.tipo == product.tipo);

        if (!foundId) {
          idList.push(product);
        }
      }
      setProddList(prodList);
      setIddList(idList);
      const dynamic = {};
      for (const prod of prodList) {
        dynamic[prod.codInterno] = {};
        for (const id of idList) {
          const found = fullList.find(
            (fl) => fl.codInterno == prod?.codInterno && fl.tipo == id?.tipo
          );
          dynamic[prod.codInterno][id.tipo] = found ? found.cantidad : 0;
        }
      }

      console.log("DYNAMIC", dynamic);
      setFullTable(dynamic);
      setTableData(res.data);
      setAuxTableData(res.data);
      setIsReport(true);
    });
  }

  const filter = (value) => {
    setFiltered(value);
    const filtered = auxTableData.filter(
      (ad) =>
        ad.cliente_razon_social.toLowerCase().includes(value.toLowerCase()) ||
        ad.ci == value
    );
    setTableData(filtered);
  };

  const roundToTwoDecimals = (num) => {
    if (Number.isInteger(num)) {
      return num;
    }
    return parseFloat(num.toFixed(2));
  };

  const exportToExcel = () => {
    const dataToExport = [];
    for (const product of proddList) {
      var obj = {};
      obj["CODIGO_PRODUCTO"] = product.codInterno;
      obj["NOMBRE_PRODUCTO"] = product.nombreProducto;
      obj["PRECIO_A"] = product.precioDeFabrica;
      for (const id of iddList) {
        obj[id.tipo] = roundToTwoDecimals(
          fullTable[product.codInterno][id.tipo]
        );
      }
      dataToExport.push(obj);
    }

    generateExcelDoubleSheets(
      dataToExport,
      tableData,
      `Reporte de productos en muestras en ${selectedStore} ${fromDate} - ${toDate}`,
      "Datos agrupados",
      "Datos con detalles"
    );

    /*generateExcel(
      tableData,
      `Reporte de productos en muestras en ${selectedStore} ${fromDate} - ${toDate}`
    );*/
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
          <Form style={{ marginBottom: "15px" }}>
            <Form.Label>Tipo de reporte</Form.Label>
            <Form.Select onChange={(e) => setReportType(e.target.value)}>
              <option value={1}>Reporte Agrupado</option>
              <option value={2}>Reporte con detalle</option>
            </Form.Select>
          </Form>

          {reportType == 2 && (
            <Form>
              <Form.Label>Filtrar por nit/razon social</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => filter(e.target.value)}
              />
            </Form>
          )}

          <div className="formLabel">Reporte de muestras</div>
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
            {reportType == 1 ? (
              <Table>
                <thead>
                  <tr
                    style={{ position: "sticky", top: 0 }}
                    className="tableHeaderReport"
                  >
                    <th>Cod Interno</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    {iddList.map((header) => {
                      return <th key={header.tipo}>{header.tipo}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {proddList.map((product, index) => {
                    return (
                      <tr key={index} className="tableRow">
                        <td>{product.codInterno}</td>
                        <td>{product.nombreProducto}</td>
                        <td>{`${product.precioDeFabrica} Bs`}</td>
                        {iddList.map((id, index) => {
                          return (
                            <td key={index}>
                              {fullTable[product.codInterno][id.tipo]}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
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
            )}
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
