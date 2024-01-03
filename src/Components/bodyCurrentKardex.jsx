import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Table, Modal, Image } from "react-bootstrap";
import { ExportPastReport } from "../services/exportServices";
import { getProducts } from "../services/productServices";
import {
  getCurrentStockProduct,
  getCurrentStockStore,
  getLogStockProduct,
  getLogStockStore,
} from "../services/stockServices";
import { getStores } from "../services/storeServices";
import "../styles/generalStyle.css";
import "../styles/reportStyles.css";
import Pagination from "./pagination";
import { ReportPDF } from "./reportPDF";
import loading2 from "../assets/loading2.gif";
import Cookies from "js-cookie";
import { generateExcel } from "../services/utils";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(25);
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
  const showAll = [1, 9, 10, 8, 7, 6, 5, 2];
  const [typeFilter, setTypeFilter] = useState("");
  const user = JSON.parse(Cookies.get("userAuth"));
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
    setCurrentPage(1);
    setSearchbox(value);
    const newList = auxDataTable.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString())
    ); //
    setDataTable([...newList]);
  }
  function selectProduct(prod) {
    setSelectedProduct(prod);

    setInternal(productList.find((pr) => pr.idProducto == prod).codInterno);
  }
  function sortBy(atributo) {
    const sorted = sortedFun(atributo);
    sorted.then((sr) => {
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
          setQuantitySorted(1);
          let sortedProducts = dataTable.sort((p1, p2) =>
            p1.cantidad < p2.cantidad ? 1 : p1.cantidad > p2.cantidad ? -1 : 0
          );
          resolve(sortedProducts);
        } else {
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
  function generateReport() {
    setAlertSec("Generando Reporte");
    setIsAlertSec(true);
    setCurrentPage(1);
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
            setIsReported(true);
            setAuxDataTable(rd.data);
            setIsAlertSec(false);
          });
        }
      }
    } else {
    }
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            <div className="reportSelector">
              <Form.Group
                className="reportOptionLarge"
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <div style={{ width: "50%" }}>
                  <Form.Label>Seleccione Producto</Form.Label>
                  <Form.Select onChange={(e) => selectProduct(e.target.value)}>
                    <option>Seleccione Producto</option>
                    {productList.map((pr, index) => {
                      return (
                        <option key={index} value={pr.idProducto}>
                          {pr.nombreProducto}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
                <div>
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
              postsperpage={recordsPerPage}
              totalposts={dataTable.length}
              paginate={paginate}
            />
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
