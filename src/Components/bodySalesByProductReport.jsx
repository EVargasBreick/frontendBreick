import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Image } from "react-bootstrap";
import Pagination from "./pagination";
import { getProductSalesReport } from "../services/reportServices";
import "../styles/formLayouts.css";
import loading2 from "../assets/loading2.gif";
import Cookies from "js-cookie";
import { ExportGeneralSalesReport } from "../services/exportServices";
export default function BodySalesByProductReport() {
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
    const formatted = formatDate();
    if (fromDate != "" && toDate != "") {
      const reportData = getProductSalesReport(
        formatted.from,
        formatted.to,
        sort,
        id
      );
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
    const newList = auxReportTable.filter(
      (dt) =>
        dt.nitCliente.toLowerCase().includes(value.toLowerCase()) ||
        dt.razonSocial
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        dt.Agencia.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        dt.nombreCompleto
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        dt.nombreProducto
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        dt.codInterno
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase())
    ); //
    setReportTable([...newList]);
  }
  function sortData(value) {
    setIsReportLoading(true);
    setSort(value);
    const formatted = formatDate();
    if (fromDate != "" && toDate != "") {
      const reportData = getProductSalesReport(
        formatted.from,
        formatted.to,
        value
      );
      reportData
        .then((response) => {
          setReportTable(response.data.data[0]);
          setAuxReportTable(response.data.data[0]);

          setIsReportLoading(false);
          if (searchBox != "") {
            searchItem(searchBox);
          }
        })
        .catch((error) => {});
    }
  }
  async function setExcelData() {
    const newArray = [];
    await Promise.all(
      reportTable.map((rt, index) => {
        const dataRecord = {
          nro: index + 1,
          "nro factura": rt.nroFactura,
          fecha: rt.fecha,
          hora: rt.hora,
          "nit cliente": rt.nitCliente,
          "razon social": rt.razonSocial,
          "importe base": rt.montoFacturar.toFixed(2),
          "debito fiscal": (rt.montoFacturar * 0.13).toFixed(2),
          "cod interno": rt.codInterno,
          producto: rt.nombreProducto,
          cantidad: rt.cantidadProducto,
          "precio unitario":
            rt.precio_producto != null
              ? rt.precio_producto
              : rt.precioDeFabrica,
          "total Producto": rt.totalProd,
          "descuento producto": rt.descuentoProducto,
          ["descuento % producto"]: (
            (rt.descuentoProducto / Number(rt.totalProd)) *
            100
          ).toFixed(2),
          vendedor: rt.nombreCompleto,
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
            return accumulator + object.montoFacturar;
          }, 0)
          .toFixed(2),
        "total debito fiscal": (
          reportTable.reduce((accumulator, object) => {
            return accumulator + object.montoFacturar;
          }, 0) * 0.13
        ).toFixed(2),
        "total productos": reportTable
          .reduce((accumulator, object) => {
            return accumulator + object.totalProd;
          }, 0)
          .toFixed(2),
        "total descuentos": reportTable
          .reduce((accumulator, object) => {
            return accumulator + object.descuentoProducto;
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
      <div className="formLabel">REPORTE DE VENTAS POR PRODUCTO</div>
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
            <div>
              <Form.Label>Ordenar por</Form.Label>
              <Form.Select
                className="reportOptionDrop"
                value={sort}
                onChange={(e) => sortData(e.target.value)}
              >
                <option value="fecha asc">Fecha</option>
                <option value="nroFactura asc">Nro Factura</option>
                <option value="nitCliente asc">Nit</option>
                <option value="razonSocial asc">Razon social</option>
                <option value="nombreCompleto asc">Vendedor</option>
                <option value="Agencia asc">Agencia</option>
                <option value="descuentoProducto desc">Descuento</option>
                <option value="nombreProducto asc">Nombre Producto</option>
              </Form.Select>
            </div>
          </Form.Group>

          <div className="reportTittle">{`LIBRO DE VENTAS ESTANDAR`}</div>
          <div className={`reportContainer `}>
            <table className={`reportTableBig ${zoom}`}>
              <thead>
                <tr className="reportHeader">
                  <th className="reportColumnXSmall">NRO</th>
                  <th className="reportColumnMedium">FECHA</th>
                  <th className="reportColumnSmall ">HORA</th>
                  <th className="reportColumnXSmall ">NRO FACTURA</th>
                  <th className="reportColumnSmall ">ZONA</th>
                  <th className="reportColumnMedium ">NIT CLIENTE</th>
                  <th className="reportColumnMedium ">RAZON SOCIAL</th>
                  <th className="reportColumnXSmall ">IMPORTE TOTAL VENTA</th>
                  <th className="reportColumnSmall "> SUB TOTAL VENTA</th>
                  <th className="reportColumnSmall ">IMPORTE BASE VENTA</th>
                  <th className="reportColumnSmall ">DEBITO FISCAL</th>
                  <th className="reportColumnMedium">COD INTERNO</th>
                  <th className="reportColumnMedium">NOMBRE PRODUCTO</th>
                  <th className="reportColumnXSmall">CAN TIDAD</th>
                  <th className="reportColumnMedium">PRECIO UNIT</th>

                  <th className="reportColumnMedium">TOTAL PROD</th>
                  <th className="reportColumnMedium">DESCUENTO PROD</th>
                  <th className="reportColumnMedium">DESC PROD %</th>
                  <th className="reportColumnMedium ">VENDEDOR</th>
                  <th className="reportColumnMedium ">AGENCIA</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((rt, index) => {
                  const precio =
                    rt.precio_producto != null
                      ? rt.precio_producto
                      : rt.precioDeFabrica;
                  return (
                    <tr className="reportBody" key={index}>
                      <td className="reportColumnXSmall">{index + 1}</td>
                      <td className="reportColumnMedium">{rt.fecha}</td>
                      <td className="reportColumnMedium">{rt.hora}</td>
                      <td className="reportCufColumnXSmall">{rt.nroFactura}</td>
                      <td className="reportCufColumn">{rt.zona}</td>
                      <td className="reportColumnXSmall">{`${rt.nitCliente}`}</td>
                      <td className="reportColumnMedium">{rt.razonSocial}</td>
                      <td className="reportColumnXSmall">
                        {rt.montoFacturar.toFixed(2)}
                      </td>
                      <td className="reportColumnSmall">
                        {" "}
                        {rt.montoFacturar.toFixed(2)}
                      </td>
                      <td className="reportColumnSmall">
                        {rt.montoFacturar.toFixed(2)}
                      </td>
                      <td className="reportColumnSmall">
                        {rt.debitoFiscal.toFixed(2)}
                      </td>
                      <td className="reportColumnMedium">{rt.codInterno}</td>
                      <td className="reportColumnMedium">
                        {rt.nombreProducto}
                      </td>
                      <td className="reportColumnMedium">
                        {rt.cantidadProducto}
                      </td>
                      <td className="reportColumnMedium">
                        {Number(precio)?.toFixed(2)}
                      </td>
                      <td className="reportColumnMedium">
                        {rt.totalProd.toFixed(2)}
                      </td>
                      <td className="reportColumnMedium">
                        {rt.descuentoProducto.toFixed(2)}
                      </td>
                      <td className="reportColumnMedium">
                        {(
                          (rt.descuentoProducto / Number(rt.totalProd)) *
                          100
                        )?.toFixed(2)}
                      </td>

                      <td className="reportColumnMedium">
                        {rt.nombreCompleto}
                      </td>
                      <td className="reportColumnMedium">{rt.Agencia}</td>
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
