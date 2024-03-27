import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Image } from "react-bootstrap";
import Pagination from "./pagination";
import {
  getProductSalesReport,
  pastSalesReport,
} from "../services/reportServices";
import "../styles/formLayouts.css";
import loading2 from "../assets/loading2.gif";
import Cookies from "js-cookie";
import { ExportGeneralSalesReport } from "../services/exportServices";
export default function BodyPastProductSalesReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportTable, setReportTable] = useState([]);
  const [auxReportTable, setAuxReportTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = reportTable.slice(indexOfFirstRecord, indexOfLastRecord);
  const [searchBox, setSearchBox] = useState("");
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [zoom, setZoom] = useState("zfull");
  const [byState, setByState] = useState("-1");
  const [sort, setSort] = useState("fecha");
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [userAct, setUserAct] = useState({});
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    setUserAct(JSON.parse(UsuarioAct));
  }, []);
  function formatDate() {
    const spplited = fromDate.split("-");
    const fromNewFormat = `${spplited[2]}/${spplited[1]}/${spplited[0]}`;
    const toSpplited = toDate.split("-");
    const toNewFormat = `${toSpplited[2]}/${toSpplited[1]}/${toSpplited[0]}`;
    return {
      from: fromNewFormat,
      to: toNewFormat,
    };
  }
  function generateReport() {
    setSearchBox("");
    setIsReportLoading(true);
    const sudo = [1, 5, 8, 9, 10, 12];
    const id = sudo.includes(userAct.rol) ? "" : userAct.idAlmacen;
    if (fromDate != "" && toDate != "") {
      const reportData = pastSalesReport({ fromDate, toDate });
      reportData
        .then((response) => {
          console.log("Data del reporte", response.data);
          setReportTable(response.data);
          setAuxReportTable(response.data);
          setIsReportLoading(false);
        })
        .catch((error) => {});
    }
  }

  function searchItem(value) {
    setCurrentPage(1);
    setSearchBox(value);

    const removePunctuationAndAccents = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "") // Remove punctuation signs
        .toLowerCase()
        .trim();
    };

    const normalizedValue = removePunctuationAndAccents(value.toString());

    const newList = auxReportTable.filter((dt) => {
      const normalizedNombreProducto = removePunctuationAndAccents(
        dt.nombreProducto.toString()
      );
      return (
        dt.razonSocial.toString().toLowerCase().includes(value) ||
        dt.Agencia.toString().toLowerCase().includes(value) ||
        normalizedNombreProducto.includes(normalizedValue) ||
        dt.codInterno.toString().toLowerCase().includes(value)
      );
    });

    setReportTable([...newList]);
  }

  async function setExcelData() {
    const newArray = [];
    await Promise.all(
      reportTable.map((rt, index) => {
        const dataRecord = {
          nro: index + 1,
          "nro factura": rt.nroFactura,
          fecha: rt.fecha,
          "razon social": rt.razonSocial,
          "importe base": rt.total.toFixed(2),
          "debito fiscal": (rt.total * 0.13).toFixed(2),
          "cod interno": rt.codInterno,
          producto: rt.nombreProducto,
          cantidad: rt.cantidadProducto,
          "precio unitario": rt.precio_producto,
          "total Producto": rt.totalProd,
          agencia: rt.Agencia,
        };
        newArray.push(dataRecord);
      })
    );

    const totales = [
      {
        "fecha desde": fromDate,
        "fecha hasta": toDate,
        "nro registros": reportTable.length,
        "total importe base": reportTable
          .reduce((accumulator, object) => {
            return accumulator + Number(object.total);
          }, 0)
          .toFixed(2),
        "total debito fiscal": (
          reportTable.reduce((accumulator, object) => {
            return accumulator + Number(object.total);
          }, 0) * 0.13
        ).toFixed(2),
        "total cantidad vendida": reportTable
          .reduce((accumulator, object) => {
            return accumulator + Number(object.cantidadProducto);
          }, 0)
          .toFixed(2),
        "total productos": reportTable
          .reduce((accumulator, object) => {
            return accumulator + Number(object.totalProd);
          }, 0)
          .toFixed(2),
      },
    ];
    const exported = ExportGeneralSalesReport(
      newArray,
      totales,
      searchBox,
      sort
    );
    exported.then((res) => {});
  }
  return (
    <div>
      <div className="formLabel">
        REPORTE DE VENTAS SISTEMAS ANTIGUOS POR PRODUCTO
      </div>
      <div className="formLabel">
        *Este reporte contiene datos limitados a la información que se pudo
        obtener*
      </div>
      <div className="formLabel">Seleccione rango de fechas</div>
      <div>
        <Form className="dateReportContainer">
          <div className="filterMiddleContainer">
            <Form.Control
              type="date"
              className="salesReportDate"
              onChange={(e) => setFromDate(e.target.value)}
              value={fromDate}
            />
          </div>
          <div className="filterMiddleContainer">
            <Form.Control
              type="date"
              className="salesReportDate"
              onChange={(e) => setToDate(e.target.value)}
              value={toDate}
            />
          </div>
          <Button className="reportButtonG" onClick={() => generateReport()}>
            Generar reporte
          </Button>
        </Form>
      </div>
      {(reportTable.length > 0 || searchBox != "" || byState != -1) &&
      !isReportLoading ? (
        <div className={`reportBody`}>
          <Form.Group className="reportZoom">
            <div>
              <Form.Label>{`Items por \n página`}</Form.Label>
              <Form.Select
                className="reportOptionDrop"
                onChange={(e) => setRecordsPerPage(e.target.value)}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </Form.Select>
            </div>
            <div>
              <Form.Label>Zoom</Form.Label>
              <Form.Select
                className="reportOptionDrop"
                onChange={(e) => setZoom(e.target.value)}
              >
                <option value="zfull">100%</option>
                <option value="zsmall">75%</option>
                <option value="zlarge">125%</option>
                <option value="zxlarge">150%</option>
              </Form.Select>
            </div>
            <div>
              <Form.Label>{`Buscar (Nit, r. social, vendedor, agencia, producto, codigo int)`}</Form.Label>
              <Form.Control
                type="text"
                placeholder="ingrese término"
                onChange={(e) => searchItem(e.target.value)}
                value={searchBox}
              />
            </div>
          </Form.Group>

          <div className="reportTittle">{`LIBRO DE VENTAS ESTANDAR`}</div>
          <div className={`reportContainer `}>
            <table className={`reportTableBig ${zoom}`}>
              <thead style={{ width: "100%" }}>
                <tr className="reportHeader">
                  <th>NRO</th>
                  <th>FECHA</th>
                  <th>NRO FACTURA</th>
                  <th style={{ width: "20%" }}>RAZON SOCIAL</th>
                  <th>IMPORTE TOTAL VENTA</th>
                  <th>DEBITO FISCAL</th>
                  <th>COD INTERNO</th>
                  <th style={{ width: "20%" }}>NOMBRE PRODUCTO</th>
                  <th>CANTIDAD</th>
                  <th>PRECIO UNIT</th>
                  <th>TOTAL PROD</th>
                  <th style={{ width: "10%" }}>AGENCIA</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((rt, index) => {
                  return (
                    <tr className="reportBody" key={index}>
                      <td>{index + 1}</td>
                      <td>{rt.fecha}</td>
                      <td>{rt.nroFactura}</td>
                      <td>{rt.razonSocial}</td>
                      <td>{rt.total.toFixed(2)}</td>
                      <td>{(rt.total * 0.13).toFixed(2)}</td>
                      <td>{rt.codInterno}</td>
                      <td>{rt.nombreProducto}</td>
                      <td>{rt.cantidadProducto}</td>
                      <td>{Number(rt.precio_producto)?.toFixed(2)}</td>
                      <td>{rt.totalProd.toFixed(2)}</td>
                      <td>{rt.Agencia}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              postsperpage={recordsPerPage}
              totalposts={reportTable.length}
              paginate={paginate}
            />
          </div>
          <Button variant="success" onClick={() => setExcelData()}>
            Exportar en Excel
          </Button>
        </div>
      ) : isReportLoading ? (
        <div className="loadingGif">
          <Image src={loading2} style={{ width: "5%" }}></Image>
        </div>
      ) : null}
    </div>
  );
}
