import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { Button, Form, Table, Modal, Image } from "react-bootstrap";
import { getProducts } from "../services/productServices";
import {
  getCurrentStockProduct,
  getCurrentStockStore,
} from "../services/stockServices";
import { getStores } from "../services/storeServices";
import "../styles/generalStyle.css";
import "../styles/reportStyles.css";
import { ReportPDF } from "./reportPDF";
import loading2 from "../assets/loading2.gif";
import Cookies from "js-cookie";
import { generateExcel } from "../services/utils";
import { KardexReportThermal } from "./kardexReportThermal";
import ReactToPrint from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { dateString } from "../services/dateServices";
import { Loader } from "./loader/Loader";
export default function BodyCurrentKardex() {
  const [isCriteria, setIsCriteria] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [productList, setProductList] = useState([]);
  const [auxProdList, setAuxProdList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [internal, setInternal] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [searchbox, setSearchbox] = useState("");
  const [auxDataTable, setAuxDataTable] = useState([]);
  const [isReported, setIsReported] = useState(false);
  const showAll = [1, 9, 10, 8, 7, 6, 5, 2, 12];
  const [typeFilter, setTypeFilter] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isThermal, setIsThermal] = useState(false);
  const thermalRef = useRef();
  const thermalWrapRef = useRef();
  const user = JSON.parse(Cookies.get("userAuth"));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const userRol = JSON.parse(Cookies.get("userAuth")).rol;
    const fecha = new Date();
    const dia = fecha.toString().split(" ");
    setSelectedDate(dia[2] + "/" + dia[1] + "/" + dia[3]);
    const productos = getProducts("all");
    productos.then((res) => {
      const filteredProd = res.data.data.filter((rd) => (rd.activo = 1));
      setProductList(filteredProd);
      setAuxProdList(filteredProd);
    });
    const agencias = getStores();
    agencias.then((res) => {
      console.log("Stores", res);
      if (showAll.includes(userRol)) {
        setStoreList(res.data);
      } else {
        const filtered = res.data.filter(
          (ag) => ag.idAgencia == user.idAlmacen
        );
        setStoreList(filtered);
        console.log("Filtered", filtered);
      }
    });

    function handleResize() {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleCriteria(valor) {
    if (valor == "") {
      setIsCriteria(false);
      setCriteria("");
    } else {
      setCriteria(valor);
      setIsCriteria(true);
    }
  }
  function searchItem(value) {
    setSearchbox(value);
    const newList = auxDataTable.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString())
    );
    setDataTable([...newList]);
  }
  function selectProduct(prod) {
    console.log("PRODUCTO SELECIONADO", prod);
    if (prod != "false") {
      setSelectedProduct(prod);

      setInternal(productList.find((pr) => pr.idProducto == prod).codInterno);
    }
  }

  function generateReport() {
    setAlertSec("Generando Reporte");
    setIsAlertSec(true);
    setLoading(true);
    setDataTable([]);

    if (criteria != "") {
      if (criteria == 1) {
        if (selectedStore == "") {
          setAlertSec("Seleccione una agencia por favor");
          setIsAlertSec(true);
          setTimeout(() => {
            setIsAlertSec(false);
          }, 1500);
        } else {
          const reportData = getCurrentStockStore(selectedStore);
          reportData.then((rd) => {
            console.log("AAAA", rd);
            setDataTable(rd.data);
            setAuxDataTable(rd.data);
            setIsAlertSec(false);
            setIsReported(true);
            setIsThermal(true);
            setLoading(false);
          });
        }
      } else {
        if (selectedProduct == "") {
          setAlertSec("Seleccione un producto por favor");
          setIsAlertSec(true);
          setTimeout(() => {
            setIsAlertSec(false);
          }, 1500);
        } else {
          const reportData = getCurrentStockProduct(selectedProduct);
          reportData.then((rd) => {
            setDataTable(rd.data);

            setAuxDataTable(rd.data);
            setIsAlertSec(false);
            setIsReported(true);
            setIsThermal(true);
            setLoading(false);
          });
        }
      }
    } else {
    }
  }

  function filterByType(value) {
    setTypeFilter(value);
    if (value == "all") {
      setDataTable(auxDataTable);
    } else {
      const filtered = auxDataTable.filter((ad) => ad.tipoProducto == value);
      setDataTable(filtered);
    }
  }

  function filterByTypeProdList(value) {
    setTypeFilter(value);
    if (value == "all") {
      setProductList(auxProdList);
    } else {
      const filtered = auxProdList.filter((ad) => ad.tipoProducto == value);
      setProductList(filtered);
    }
  }

  function filterBySingleProduct(value) {
    setSearchProduct(value);
    const newList = auxProdList.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setProductList(newList);
  }

  const handleDownloadPdfInv = async () => {
    if (thermalRef.current) {
      const element = thermalRef.current;
      console.log("Thermal ref", JSON.stringify(element));
      const canvas = await html2canvas(element);
      console.log("canvas", canvas);
      const data = canvas.toDataURL("image/png");
      console.log("Data", data);
      const node = thermalWrapRef.current;
      const { height } = node.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const mmHeight = height / ((dpr * 96) / 25.4);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, mmHeight * 1.5 + 20],
      });
      const imgProperties = pdf.getImageProperties(data);

      const pdfWidth = 78;
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Instead of directly saving the PDF, create a download link
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = `reporte de kardex actual-${selectedStore}-${dateString()}.pdf`;
      document.body.appendChild(downloadLink);

      // Trigger a click on the download link
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(pdfUrl);
    } else {
      console.log("El current nuay");
    }
  };

  return (
    <div>
      <div className="formLabel">REPORTE DE KARDEX EN TIEMPO REAL</div>
      <Modal show={isAlertSec}>
        <Modal.Header>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Form>
        <div className="reportSelector">
          <Form.Group className="reportOption">
            <Form.Label>Criterio de Reporte</Form.Label>
            <Form.Select
              onChange={(e) => handleCriteria(e.target.value)}
              className="reportOptionDrop"
            >
              <option value="">Seleccione criterio</option>
              <option value="1">Por Agencia</option>
              {showAll.includes(user.rol) ? (
                <option value="2">Por Producto</option>
              ) : null}
            </Form.Select>
          </Form.Group>
        </div>
        {isCriteria ? (
          criteria == "1" ? (
            <div className="reportSelector">
              <Form.Group className="reportOptionLarge">
                <Form.Label>Seleccione Agencia</Form.Label>
                <Form.Select
                  className="reportOptionDrop"
                  onChange={(e) => setSelectedStore(e.target.value)}
                >
                  <option>Seleccione Agencia</option>
                  {storeList.map((st, index) => {
                    return (
                      <option
                        key={index}
                        value={st.idAgencia}
                      >{`Agencia ${st.Nombre}`}</option>
                    );
                  })}
                </Form.Select>
              </Form.Group>

              <div className="reportButtonContainer">
                <Button
                  className="reportButton"
                  variant="warning"
                  onClick={() => generateReport()}
                >
                  Generar Reporte
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="reportSelector"
              style={{
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile && "center",
              }}
            >
              <Form.Group
                className="reportOptionLarge"
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: isMobile ? "100%" : "80%",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile && "center",
                }}
              >
                <div style={{ width: isMobile ? "80%" : "45%" }}>
                  <Form.Label>Seleccione Producto</Form.Label>
                  <Form.Select
                    onChange={(e) => selectProduct(e.target.value)}
                    onMouseDown={(e) => selectProduct(e.target.value)}
                  >
                    <option value={false}>Seleccione Producto</option>
                    {productList.map((pr, index) => {
                      return (
                        <option key={index} value={pr.idProducto}>
                          {pr.nombreProducto}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
                <div style={{ width: isMobile ? "80%" : "25%" }}>
                  <Form.Label>Tipo de producto</Form.Label>
                  <Form.Select
                    onChange={(e) => filterByTypeProdList(e.target.value)}
                    value={typeFilter}
                  >
                    <option value="all">Todos</option>
                    <option value="1">Tradicionales</option>
                    <option value="2">Pascua</option>
                    <option value="4">Halloween</option>
                    <option value="3">Navidad</option>
                  </Form.Select>
                </div>
                <div style={{ width: isMobile ? "80%" : "25%" }}>
                  <Form.Label>Buscar Producto</Form.Label>
                  <Form.Control
                    value={searchProduct}
                    onChange={(e) => filterBySingleProduct(e.target.value)}
                  />
                </div>
              </Form.Group>
              <div className="reportButtonContainer">
                <Button
                  className="reportButton"
                  variant="warning"
                  onClick={() => generateReport()}
                >
                  Generar Reporte
                </Button>
              </div>
            </div>
          )
        ) : null}
      </Form>

      {isReported ? (
        <div>
          <Form>
            <Form.Group
              className="reportSearchL"
              controlId="rsearch"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="..."
                  onChange={(e) => searchItem(e.target.value)}
                  value={searchbox}
                />
              </div>
              <div>
                <Form.Label>Filtrar por tipo de producto</Form.Label>
                <Form.Select
                  onChange={(e) => filterByType(e.target.value)}
                  value={typeFilter}
                >
                  <option value="all">Todos</option>
                  <option value="1">Tradicionales</option>
                  <option value="2">Pascua</option>
                  <option value="4">Halloween</option>
                  <option value="3">Navidad</option>
                </Form.Select>
              </div>
            </Form.Group>
          </Form>
          <div
            style={{
              maxHeight: "70vh",
              overflow: "auto",
              marginBottom: "20px",
            }}
          >
            <Table bordered>
              <thead className="sticky">
                <tr className="tableHeaderReport">
                  <td className="tableHeaderColS">Nº</td>

                  <td className="tableHeaderColM">{`Codigo  `}</td>
                  <td className="tableHeaderColL">{`Producto `}</td>
                  <td className="tableHeaderColM">{`Precio  `}</td>
                  <td className="tableHeaderColM">{`Cantidad  `}</td>
                  <td className="tableHeaderColM">{`Agencia/Almacen  `}</td>
                </tr>
              </thead>
              <tbody>
                {dataTable.map((dt, index) => {
                  return (
                    <tr className="tableBodyReport" key={index}>
                      <td>{index + 1}</td>

                      <td>{dt.codInterno}</td>
                      <td>{dt.nombreProducto}</td>
                      <td>{dt.precioDeFabrica + " Bs."}</td>
                      <td>{dt.cantidad}</td>
                      <td>{dt.NombreAgencia}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="reportButtonGroup">
            <Button
              className="excelButton"
              onClick={() =>
                generateExcel(
                  dataTable,
                  `Reporte de kardex actual ${selectedDate} - ${selectedStore}`
                )
              }
              variant="success"
            >
              Exportar Excel
            </Button>

            <PDFDownloadLink
              document={
                <ReportPDF fecha={selectedDate} productos={dataTable} />
              }
              fileName={`Reporte ${
                selectedStore != "" ? selectedStore : internal
              } en ${selectedDate}`}
            >
              <Button className="pdfButton" variant="danger">
                Exportar PDF
              </Button>
            </PDFDownloadLink>
            {/*isThermal ? (
              <div>
                <button type="button" onClick={handleDownloadPdfInv}>
                  Download as PDF
                </button>
                <div ref={thermalWrapRef} hidden>
                  <KardexReportThermal
                    agencia={selectedStore}
                    productList={dataTable}
                    ref={thermalRef}
                  />
                </div>
              </div>
            ) : null*/}
          </div>
        </div>
      ) : null}
      {loading && <Loader />}
    </div>
  );
}
