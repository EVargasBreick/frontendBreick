import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Button, Form, Image } from "react-bootstrap";
import Pagination from "./pagination";
import { getGeneralSalesReport } from "../services/reportServices";
import "../styles/formLayouts.css";
import loading2 from "../assets/loading2.gif";
import { ExportGeneralSalesReport } from "../services/exportServices";
import Cookies from "js-cookie";
export default function BodySalesReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [newCuf, setNewCuf] = useState("");
  const [reportTable, setReportTable] = useState([]);
  const [auxReportTable, setAuxReportTable] = useState([]);
  const auxReportTableFilter = useRef([]);
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
    const cuf = `LAHJSDFLJSHAGFSAHJBCLSJHGFALSGFSHDFLAHJSDFLJSHAGFSAHJBCLSJHGFALSGFSHDFLAHJSDFLJSHAGFSAHJBCLSJHGFALSGFSHDFLAHJSDFLJSHAGFSAHJBCLSJHGFALSGFSHDF`;
    const splitedCuf = cuf.match(/.{40}/g);
    setNewCuf(splitedCuf.join(" "));
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
    setIsReportLoading(true);
    const sudo = [1, 5, 8, 9, 10, 12];
    const id = sudo.includes(userAct.rol) ? "" : userAct.idAlmacen;
    const formatted = formatDate();
    if (fromDate != "" && toDate != "") {
      const reportData = getGeneralSalesReport(
        formatted.from,
        formatted.to,
        sort,
        id
      );
      reportData
        .then((response) => {
          console.log("Data", response);
          setReportTable(response.data);
          setAuxReportTable(response.data);
          auxReportTableFilter.current = response.data;

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
          .includes(value.toString().toLowerCase())
    ); //

    auxReportTableFilter.current = [...newList];
    console.log("newList", byState);
    if (byState != 2 && byState != -1) {
      filterByState(byState);
    } else {
      setReportTable([...newList]);
    }
  }
  function filterByState(value) {
    setByState(value);
    if (value == 2) {
      setReportTable(auxReportTableFilter.current);
    } else {
      if (value == 0) {
        const newList = auxReportTableFilter.current.filter(
          (dt) => dt.estado == 0
        );
        setReportTable([...newList]);
      } else {
        const newList = auxReportTableFilter.current.filter(
          (dt) => dt.estado == 1
        );
        setReportTable([...newList]);
      }
    }
  }
  function sortData(value) {
    setIsReportLoading(true);
    setSort(value);
    const formatted = formatDate();
    if (fromDate != "" && toDate != "") {
      const reportData = getGeneralSalesReport(
        formatted.from,
        formatted.to,
        value
      );
      reportData
        .then((response) => {
          setReportTable(response.data.data[0]);
          setAuxReportTable(response.data.data[0]);

          setIsReportLoading(false);
        })
        .catch((error) => {});
    }
  }
  function countElements(array, condition) {
    let count = 0;
    for (let element of array) {
      if (condition(element)) {
        count++;
      }
    }
    return count;
  }
  function sumElements(array, condition) {
    let sum = 0;
    for (let element of array) {
      if (condition(element)) {
        sum = sum + element.montoFacturar;
      }
    }
    return sum;
  }
  async function setExcelData() {
    const newArray = [];
    await Promise.all(
      reportTable.map((rt, index) => {
        const dataRecord = {
          nro: index + 1,
          fecha: rt.fecha,
          hora: rt.hora,
          nroFactura: rt.nroFactura,
          cuf: rt.cuf,
          "nit cliente": rt.nitCliente,
          complemento: 0,
          "razon social": rt.razonSocial,
          "importe total": parseFloat(rt.montoTotal),
          ICE: 0,
          IEHD: 0,
          IPJ: 0,
          TASAS: 0,
          "NO IVA": 0,
          EXPORTACIONES: 0,
          GRAVADAS: 0,
          "Sub Total": rt.montoTotal,
          descuentos: (rt.montoTotal - rt.montoFacturar).toFixed(2),
          "gift card": 0,
          "importe base": parseFloat(rt.montoFacturar.toFixed(2)),
          "debito fiscal": parseFloat((rt.montoFacturar * 0.13).toFixed(2)),
          estado: rt.estado == 0 ? "Valida" : "Anulada",
          "derecho fiscal": "si",
          vendedor: rt.nombreCompleto,
          agencia: rt.Agencia,
          "monto a pagar":
            rt.desembolsada == 0 ? 0 : rt.montoFacturar.toFixed(2),
          "url siat": `https://siat.impuestos.gob.bo/consulta/QR?nit=128153028&cuf=${rt.cuf}&numero=${rt.nroFactura}`,
        };
        newArray.push(dataRecord);
      })
    );

    const totales = [
      {
        "fecha desde": fromDate,
        "fecha hasta": toDate,
        "nro registros": reportTable.length,
        "suma importe total": reportTable
          .reduce((accumulator, object) => {
            return accumulator + object.montoTotal;
          }, 0)
          .toFixed(2),
        "total ice": 0.0,
        "total iehd": 0.0,
        "total ipj": 0.0,
        "total tasas": 0.0,
        "total no iva": 0.0,
        "total exportaciones": 0.0,
        "total gravadas": 0.0,
        "sub total": reportTable
          .reduce((accumulator, object) => {
            return accumulator + object.montoTotal;
          }, 0)
          .toFixed(2),
        descuentos: (
          reportTable.reduce((accumulator, object) => {
            return accumulator + object.montoTotal;
          }, 0) -
          reportTable.reduce((accumulator, object) => {
            return accumulator + object.montoFacturar;
          }, 0)
        ).toFixed(2),
        "total gift card": 0,
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
        "facturas validas": countElements(
          reportTable,
          (dato) => dato.estado == 0
        ),
        "facturas anuladas": countElements(
          reportTable,
          (dato) => dato.estado == 1
        ),
        "cant facturas pagadas": countElements(
          reportTable,
          (dato) => dato.desembolsada == 0
        ),
        "cant facturas por pagar": countElements(
          reportTable,
          (dato) => dato.desembolsada == 1
        ),
        "total bs facturas pagadas": sumElements(
          reportTable,
          (dato) => dato.estado == 0
        ),
        "total bs facturas por pagar ": sumElements(
          reportTable,
          (dato) => dato.estado == 1
        ),
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
  function formattedCuf(cuf) {
    const splitted = cuf.match(/.{25}/g);
    return splitted ? splitted.join(" ") : cuf;
  }

  function goToSiat(cuf, nroFactura) {
    const url = `https://siat.impuestos.gob.bo/consulta/QR?nit=128153028&cuf=${cuf}&numero=${nroFactura}`;
    window.open(url, "_blank");
  }

  return (
    <div>
      <div className="formLabel">REPORTE GENERAL DE VENTAS</div>
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
        </Form>
        <Button
          className="reportButtonG"
          style={{ marginBottom: "10px" }}
          onClick={() => generateReport()}
        >
          Generar reporte
        </Button>
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
              <Form.Label>{`Buscar (Nit, r. social, vendedor, agencia)`}</Form.Label>
              <Form.Control
                type="text"
                placeholder="ingrese término"
                onChange={(e) => searchItem(e.target.value)}
                value={searchBox}
              />
            </div>
            <div>
              <Form.Label>Estado de las facturas</Form.Label>
              <Form.Select
                className="reportOptionDrop"
                value={byState}
                onChange={(e) => filterByState(e.target.value)}
              >
                <option value="2">Todas</option>
                <option value="0">Validas</option>
                <option value="1">Anuladas</option>
              </Form.Select>
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
                <option value="hora">Hora</option>
                <option value="montoFacturar desc">Importe Base</option>
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
                  <th className="reportColumnSmall ">NRO FACTURA</th>
                  <th className="reportColumnMedium ">NIT CLIENTE</th>
                  <th className="reportColumnXSmall ">COMPLE MENTO</th>
                  <th className="reportColumnMedium ">RAZON SOCIAL</th>
                  <th className="reportColumnXSmall ">IMPORTE TOTAL</th>
                  <th className="reportColumnXSmall ">ICE</th>
                  <th className="reportColumnXSmall ">IEHD</th>
                  <th className="reportColumnXSmall ">IPJ</th>
                  <th className="reportColumnXSmall ">TASAS</th>
                  <th className="reportColumnXSmall ">NO IVA</th>

                  <th className="reportColumnSmall "> SUB TOTAL</th>
                  <th className="reportColumnSmall ">DCTOS</th>
                  <th className="reportColumnXSmall ">GIFT CARD</th>
                  <th className="reportColumnSmall ">IMPORTE BASE</th>
                  <th className="reportColumnSmall ">DEBITO FISCAL</th>
                  <th className="reportColumnSmall ">ESTADO</th>
                  <th className="reportColumnSmall ">DERECHO FISCAL</th>

                  <th className="reportColumnMedium ">VENDEDOR</th>
                  <th className="reportColumnMedium ">AGENCIA</th>
                  <th className="reportColumnMedium ">VER EN SIAT</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((rt, index) => {
                  return (
                    <tr className="reportBody" key={index}>
                      <td className="reportColumnXSmall">{index + 1}</td>
                      <td className="reportColumnMedium">{rt.fecha}</td>
                      <td className="reportColumnMedium">{rt.hora}</td>
                      <td className="reportCufColumn">{rt.nroFactura}</td>
                      <td className="reportColumnXSmall">{`${rt.nitCliente}`}</td>
                      <td className="reportColumnXSmall">{0}</td>
                      <td className="reportColumnMedium">{rt.razonSocial}</td>
                      <td className="reportColumnXSmall">{rt.montoTotal}</td>
                      <td className="reportColumnXSmall">0</td>
                      <td className="reportColumnXSmall">0</td>
                      <td className="reportColumnXSmall">0</td>
                      <td className="reportColumnXSmall">0</td>
                      <td className="reportColumnXSmall">0</td>

                      <td className="reportColumnSmall"> {rt.montoTotal}</td>
                      <td className="reportColumnSmall">
                        {(rt.montoTotal - rt.montoFacturar).toFixed(2)}
                      </td>
                      <td className="reportColumnXSmall">
                        {rt.vale.toFixed(2)}
                      </td>
                      <td className="reportColumnSmall">
                        {rt.montoFacturar.toFixed(2)}
                      </td>
                      <td className="reportColumnSmall">
                        {(rt.montoFacturar * 0.13).toFixed(2)}
                      </td>
                      <td className="reportColumnSmall">
                        {rt.estado == 0 ? "Valida" : "Anulada"}
                      </td>
                      <td className="reportColumnSmall">SI</td>

                      <td className="reportColumnMedium">
                        {rt.nombreCompleto}
                      </td>
                      <td className="reportColumnMedium">{rt.Agencia}</td>
                      <td className="reportColumnMedium">
                        {
                          <Button
                            variant="success"
                            onClick={() => goToSiat(rt.cuf, rt.nroFactura)}
                          >
                            Ver
                          </Button>
                        }
                      </td>
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
