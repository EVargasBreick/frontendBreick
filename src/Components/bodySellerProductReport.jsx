import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { userService } from "../services/userServices";
import { sellerProductReport } from "../services/reportServices";
import { generateExcel } from "../services/utils";

export default function BodySellerProductReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [userList, setUserList] = useState("");
  const [reportData, setReportData] = useState("");
  const [fullTable, setFullTable] = useState();
  const [headers, setHeaders] = useState([]);
  const [productList, setProductList] = useState([]);
  const [uniqueProds, setUniqueProds] = useState([]);
  const notUsers = [1, 7, 11];
  useEffect(() => {
    const userData = userService.getAll();
    userData
      .then((res) => {
        const filtered = res.filter((entry) => !notUsers.includes(entry.rol));
        //console.log("Filtered", filtered);
        setUserList(filtered);
      })
      .catch((err) => {
        console.log("Error al cargar los usuarios", err);
      });
  }, []);

  useEffect(() => {
    if (reportData.length > 0) {
      structureData();
    }
  }, [reportData]);

  useEffect(() => {
    if (fullTable) {
      const itemNames = Object.keys(fullTable);
      const personNames = Object.keys(fullTable[itemNames[0]]);
      setHeaders(personNames);
      setProductList(itemNames);
    }
  }, [fullTable]);

  function structureData() {
    const uniqueArray = uniqueProducts(reportData);
    setUniqueProds(uniqueArray);
    const dynamic = {};
    for (const prodUni of uniqueArray) {
      dynamic[prodUni.nombreProducto] = {};
      const filtered = reportData.filter(
        (rd) => rd.idProducto === prodUni.idProducto
      );
      for (const user of userList) {
        const foundName = filtered.find((fn) => fn.idUsuario == user.idUsuario);
        const splitted = user.apPaterno.split(" ");
        const name = user.nombre + " " + splitted[0];
        dynamic[prodUni.nombreProducto][name] = foundName
          ? foundName.totalVendido
          : 0;
      }
    }
    //console.log("Tabla dinamica", dynamic);
    setFullTable(dynamic);
  }

  function uniqueProducts() {
    const unique = [];
    reportData.forEach((rd) => {
      const existe = unique.some((un) => un.idProducto === rd.idProducto);
      if (!existe) {
        unique.push(rd);
      }
    });
    return unique;
  }

  async function getReport() {
    const report = await sellerProductReport(fromDate, toDate);
    setReportData(report.data);
    //console.log("Datos del reporte", report);
  }

  const roundToTwoDecimals = (num) => {
    if (Number.isInteger(num)) {
      return num;
    }
    return parseFloat(num.toFixed(2));
  };

  function formatToExport() {
    const dataObject = [];
    for (const pl of productList) {
      var obj = {};
      //console.log("Pusheando de pl");
      const found = uniqueProds.find(
        (up) => up.nombreProducto === pl
      ).codInterno;
      obj.codInterno = found;
      obj["- Producto"] = pl;
      for (const hd of headers) {
        //console.log("Pusheando de hd");
        obj[hd] = roundToTwoDecimals(fullTable[pl][hd]);
      }
      dataObject.push(obj);
    }

    console.log("Resultado", dataObject);
    generateExcel(dataObject, `Rep-vendedores-prod-${fromDate}--${toDate}`);
  }

  return (
    <div>
      <div className="formLabel">
        REPORTE AGRUPADO DE PRODUCTOS POR VENDEDOR
      </div>

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
      </Form>
      {fromDate != "" && toDate != "" ? (
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
          <div>Seleccione rango de fechas</div>
        </div>
      )}
      {headers.length > 0 && productList.length > 0 ? (
        <div style={{ maxWidth: "90vw", overflow: "auto", maxHeight: "75vh" }}>
          <Table bordered striped>
            <thead>
              <tr className="tableHeader">
                <th>Cod Interno</th>
                <th>Producto</th>
                {headers.map((name) => (
                  <th key={name}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productList.map((item) => {
                const found = uniqueProds.find(
                  (up) => up.nombreProducto === item
                ).codInterno;
                return (
                  <tr key={item} className="tableRow">
                    <td>{found}</td>
                    <td>{item}</td>
                    {headers.map((name) => (
                      <td key={name}>
                        {roundToTwoDecimals(fullTable[item][name])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : null}
      {reportData.length > 0 ? (
        <div style={{ margin: "20px" }}>
          {" "}
          <Button variant="success" onClick={() => formatToExport()}>
            Exportar a excel
          </Button>
        </div>
      ) : null}
    </div>
  );
}
