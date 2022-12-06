import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Table, Modal, Image } from "react-bootstrap";
import { ExportPastReport } from "../services/exportServices";
import { getProducts } from "../services/productServices";
import {
  getLogStockProduct,
  getLogStockStore,
} from "../services/stockServices";
import { getStores } from "../services/storeServices";
import "../styles/generalStyle.css";
import "../styles/reportStyles.css";
import Pagination from "./pagination";
import { ReportPDF } from "./reportPDF";
import loading2 from "../assets/loading2.gif";
export default function BodyLogKardex() {
  const [isCriteria, setIsCriteria] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [productList, setProductList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = dataTable.slice(indexOfFirstRecord, indexOfLastRecord);
  const [quantitySorted, setQuantitySorted] = useState(0);
  const [storeSorted, setStoreSorted] = useState(0);
  const [productSorted, setProductSorted] = useState();
  const [isPSorted, setIsPSorted] = useState(false);
  const [isQSorted, setIsQSorted] = useState(false);
  const [isSSorted, setIsSSorted] = useState(false);
  const [codeSorted, setCodeSorted] = useState(0);
  const [isCSorted, setIsCSorted] = useState(false);
  const [priceSorted, setPriceSorted] = useState(0);
  const [isPrSorted, setIsPrSorted] = useState(false);
  const [internal, setInternal] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [searchbox, setSearchbox] = useState("");
  const [auxDataTable, setAuxDataTable] = useState([]);
  const [isReported, setIsReported] = useState(false);
  useEffect(() => {
    const productos = getProducts("all");
    productos.then((res) => {
      setProductList(res.data.data[0]);
    });
    const agencias = getStores();
    agencias.then((res) => {
      console.log("Agencias", res.data[0]);
      setStoreList(res.data[0]);
    });
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
  function selectProduct(prod) {
    setSelectedProduct(prod);
    console.log("Id elegido", prod);
    setInternal(productList.find((pr) => pr.idProducto == prod).codInterno);
  }
  function sortBy(atributo) {
    const sorted = sortedFun(atributo);
    sorted.then((sr) => {
      console.log("Sorted", sr);
      setDataTable([...sr]);
    });
  }

  function sortedFun(atributo) {
    return new Promise((resolve) => {
      if (atributo == "cantidad") {
        setIsQSorted(true);
        setIsSSorted(false);
        setIsPSorted(false);
        setIsPrSorted(false);
        setIsCSorted(false);
        if (quantitySorted == 0) {
          console.log("Ascendente");
          setQuantitySorted(1);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.cantidad < p2.cantidad ? 1 : p1.cantidad > p2.cantidad ? -1 : 0
          );
          resolve(sortedProducts);
        } else {
          console.log("Descendente");
          setQuantitySorted(0);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.cantidad > p2.cantidad ? 1 : p1.cantidad < p2.cantidad ? -1 : 0
          );
          resolve(sortedProducts);
        }
      }
      if (atributo == "agencia") {
        setIsPSorted(false);
        setIsSSorted(true);
        setIsQSorted(false);
        setIsPrSorted(false);
        setIsCSorted(false);
        if (storeSorted == 0) {
          console.log("Ascendente");
          setStoreSorted(1);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.NombreAgencia < p2.NombreAgencia
              ? 1
              : p1.NombreAgencia > p2.NombreAgencia
              ? -1
              : 0
          );
          resolve(sortedProducts);
        } else {
          console.log("Descendente");
          setStoreSorted(0);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.NombreAgencia > p2.NombreAgencia
              ? 1
              : p1.NombreAgencia < p2.NombreAgencia
              ? -1
              : 0
          );
          resolve(sortedProducts);
        }
      }
      if (atributo == "producto") {
        setIsPSorted(true);
        setIsSSorted(false);
        setIsQSorted(false);
        setIsPrSorted(false);
        setIsCSorted(false);
        if (productSorted == 0) {
          console.log("Ascendente");
          setProductSorted(1);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.nombreProducto < p2.nombreProducto
              ? 1
              : p1.nombreProducto > p2.nombreProducto
              ? -1
              : 0
          );
          resolve(sortedProducts);
        } else {
          console.log("Descendente");
          setProductSorted(0);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.nombreProducto > p2.nombreProducto
              ? 1
              : p1.nombreProducto < p2.nombreProducto
              ? -1
              : 0
          );
          resolve(sortedProducts);
        }
      }
      if (atributo == "codigo") {
        setIsPSorted(false);
        setIsSSorted(false);
        setIsQSorted(false);
        setIsPrSorted(false);
        setIsCSorted(true);
        if (codeSorted == 0) {
          console.log("Ascendente");
          setCodeSorted(1);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.codInterno < p2.codInterno
              ? 1
              : p1.codInterno > p2.codInterno
              ? -1
              : 0
          );
          resolve(sortedProducts);
        } else {
          console.log("Descendente");
          setCodeSorted(0);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.codInterno > p2.codInterno
              ? 1
              : p1.codInterno < p2.codInterno
              ? -1
              : 0
          );
          resolve(sortedProducts);
        }
      }
      if (atributo == "precio") {
        setIsPSorted(false);
        setIsSSorted(false);
        setIsQSorted(false);
        setIsPrSorted(true);
        setIsCSorted(false);
        if (priceSorted == 0) {
          console.log("Ascendente");
          setPriceSorted(1);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.precioDeFabrica < p2.precioDeFabrica
              ? 1
              : p1.precioDeFabrica > p2.precioDeFabrica
              ? -1
              : 0
          );
          resolve(sortedProducts);
        } else {
          console.log("Descendente");
          setPriceSorted(0);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.precioDeFabrica > p2.precioDeFabrica
              ? 1
              : p1.precioDeFabrica < p2.precioDeFabrica
              ? -1
              : 0
          );
          resolve(sortedProducts);
        }
      }
    });
  }
  function searchItem(value) {
    setCurrentPage(1);
    setSearchbox(value);
    const newList = auxDataTable.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString())
    ); //
    setDataTable([...newList]);
  }
  function generateReport() {
    setSearchbox("");
    setAlertSec("Generando Reporte");
    setIsAlertSec(true);
    setCurrentPage(1);
    setDataTable([]);
    console.log("Generando reporte ... ");
    if (criteria != "") {
      if (criteria == 1) {
        if (selectedDate == "" || selectedStore == "") {
          console.log("Seleccione una fecha y una agencia por favor");
          setAlertSec("Seleccione una fecha y una agencia por favor");
          setIsAlertSec(true);
          setTimeout(() => {
            setIsAlertSec(false);
          }, 1500);
        } else {
          const reportData = getLogStockStore(selectedStore, selectedDate);
          reportData.then((rd) => {
            console.log("Datos obtenidos:", rd.data[0]);
            setAuxDataTable(rd.data[0]);
            setDataTable(rd.data[0]);
            setIsAlertSec(false);
            setIsReported(true);
          });
          console.log("Fecha", selectedDate);
          console.log("Id agencia", selectedStore);
        }
      } else {
        if (selectedDate == "" || selectedProduct == "") {
          console.log("Seleccione una fecha y un producto por favor");
        } else {
          const reportData = getLogStockProduct(selectedProduct, selectedDate);
          reportData.then((rd) => {
            console.log("Datos obtenidos:", rd.data[0]);
            setAuxDataTable(rd.data[0]);
            setDataTable(rd.data[0]);
            setIsAlertSec(false);
            setIsReported(true);
          });
          console.log("Fecha", selectedDate);
          console.log("Id Producto", selectedProduct);
        }
      }
    } else {
      console.log("Seleccione un criterio para el reporte por favor");
    }
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
      <div className="formLabel">REPORTE DE KARDEX POR FECHAS</div>
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
            <Form.Label>Seleccione fecha</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="reportOption">
            <Form.Label>Criterio de Reporte</Form.Label>
            <Form.Select
              onChange={(e) => handleCriteria(e.target.value)}
              className="reportOptionDrop"
            >
              <option value="">Seleccione criterio</option>
              <option value="1">Por Agencia</option>
              <option value="2">Por Producto</option>
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
            <div className="reportSelector">
              <Form.Group className="reportOptionLarge">
                <Form.Label>Seleccione Producto</Form.Label>
                <Form.Select
                  className="reportOptionDrop"
                  onChange={(e) => selectProduct(e.target.value)}
                >
                  <option>Seleccione Producto</option>
                  {productList.map((pr, index) => {
                    return (
                      <option key={index} value={pr.idProducto}>
                        {pr.nombreProducto}
                      </option>
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
          )
        ) : null}
      </Form>
      {isReported ? (
        <div className="reportTable">
          <div className="headerRows">
            <div className="reportDate">{`Fecha: ${
              selectedDate.split("-")[2]
            }/${selectedDate.split("-")[1]}/${
              selectedDate.split("-")[0]
            }`}</div>
            <Form>
              <Form.Group
                className="reportSearch"
                controlId="rsearch"
                onChange={(e) => searchItem(e.target.value)}
                value={searchbox}
              >
                <Form.Control type="text" placeholder="Buscar" />
              </Form.Group>
            </Form>
          </div>

          <div className="tableScroll">
            <Table bordered>
              <thead className="sticky">
                <tr className="tableHeaderReport">
                  <td className="tableHeaderColS">Nº</td>

                  <td
                    className="tableHeaderColM"
                    onClick={() => {
                      sortBy("codigo");
                    }}
                  >
                    {`Codigo  ${
                      !isCSorted ? "-" : codeSorted == 0 ? "▲" : "▼"
                    }`}
                  </td>
                  <td
                    className="tableHeaderColL"
                    onClick={() => {
                      sortBy("producto");
                    }}
                  >
                    {`Producto  ${
                      !isPSorted ? "-" : productSorted == 0 ? "▲" : "▼"
                    }`}
                  </td>
                  <td
                    className="tableHeaderColM"
                    onClick={() => {
                      sortBy("precio");
                    }}
                  >{`Precio  ${
                    !isPrSorted ? "-" : priceSorted == 0 ? "▲" : "▼"
                  }`}</td>
                  <td
                    className="tableHeaderColM"
                    onClick={() => {
                      sortBy("cantidad");
                    }}
                  >
                    {`Cantidad  ${
                      !isQSorted ? "-" : quantitySorted == 0 ? "▲" : "▼"
                    }`}
                  </td>
                  <td
                    className="tableHeaderColM"
                    onClick={() => {
                      sortBy("agencia");
                    }}
                  >
                    {`Agencia/Almacen  ${
                      !isSSorted ? "-" : storeSorted == 0 ? "▲" : "▼"
                    }`}
                  </td>
                </tr>
              </thead>
              <tbody>
                {currentData.map((dt, index) => {
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
            <Pagination
              postsPerPage={recordsPerPage}
              totalPosts={dataTable.length}
              paginate={paginate}
            />
          </div>
          <div className="reportButtonGroup">
            <Button
              className="excelButton"
              onClick={() =>
                ExportPastReport(
                  dataTable,
                  selectedStore != "" ? selectedStore : internal,
                  selectedDate
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
