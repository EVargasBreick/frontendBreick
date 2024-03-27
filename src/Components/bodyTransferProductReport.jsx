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
  transferProductReport,
} from "../services/reportServices";
import { Loader } from "./loader/Loader";
//import { roundToTwoDecimalPlaces } from "../services/mathServices";
export default function BodyTransferProductReport() {
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
  }, []);
  const [storeList, setStoreList] = useState([]);
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
  const [loading, setLoading] = useState(false);

  const handleStore = (value) => {
    setSelectedStore(value);
  };
  async function getReport() {
    setLoading(true);
    const dataReport = transferProductReport(fromDate, toDate, selectedStore);
    dataReport.then((res) => {
      console.log("Data", res.data);
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

        const foundId = idList.find((il) => il?.codigo == product.codigo);

        if (!foundId) {
          idList.push(product);
        }
      }
      console.log("Prod list", idList);
      setProddList(prodList);
      setIddList(idList);
      const dynamic = {};
      for (const prod of prodList) {
        dynamic[prod.codInterno] = {};
        for (const id of idList) {
          const found = fullList.find(
            (fl) => fl.codInterno == prod?.codInterno && fl.codigo == id?.codigo
          );

          dynamic[prod.codInterno][id.codigo] = found
            ? found.cantidadProducto
            : 0;
        }
      }

      console.log("DYNAMIC", dynamic);
      setFullTable(dynamic);
      setIsReport(true);
      setLoading(false);
    });
  }

  const roundToTwoDecimals = (num) => {
    if (Number.isInteger(num)) {
      return num;
    }
    return Number(num).toFixed(2);
  };

  const exportToExcel = () => {
    const dataToExport = [];
    for (const product of proddList) {
      var obj = {};
      obj["CODIGO_PRODUCTO"] = product.codInterno;
      obj["NOMBRE_PRODUCTO"] = product.nombreProducto;
      obj["PRECIO_A"] = product.precioDeFabrica;
      for (const id of iddList) {
        obj[id.codigo] = roundToTwoDecimals(
          fullTable[product.codInterno][id.codigo]
        );
      }
      dataToExport.push(obj);
    }

    /*generateExcelDoubleSheets(
      dataToExport,
      tableData,
      `Reporte de productos en muestras en ${selectedStore} ${fromDate} - ${toDate}`,
      "Datos agrupados",
      "Datos con detalles"
    );*/

    const agNombre = storeList.find(
      (sl) => sl.idagencia == selectedStore
    )?.nombre;

    generateExcel(
      dataToExport,
      `Reporte de productos por traspaso en ${agNombre} ${fromDate} - ${toDate}`
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
          <div className="formLabel">Reporte de muestras</div>
          <div style={{ maxHeight: "70vh", overflow: "auto" }}>
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
                    return <th key={header.codigo}>{header.codigo}</th>;
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
                            {fullTable[product.codInterno][id.codigo]}
                          </td>
                        );
                      })}
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
      {loading && <Loader />}
    </div>
  );
}
