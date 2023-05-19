import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import {
  getMobileSalePoints,
  getSalePointsAndStores,
} from "../services/storeServices";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { getInvoiceToRePrint } from "../services/invoiceServices";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { useRef } from "react";
import { InvoiceComponentCopy } from "./invoiceComponentCopy";
import { InvoiceComponentAlt } from "./invoiceComponentAlt";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default function FormRePrintInvoices() {
  const [idAgencia, setIdAgencia] = useState("");
  const [pdv, setPdv] = useState("");
  const [nroFactura, setNroFactura] = useState("");
  const [pdvList, setPdvList] = useState([]);
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [isInvoice, setIsInvoice] = useState(false);
  const [isFactura, setIsFactura] = useState(false);
  const [fullInvData, setFullInvData] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const componentRef = useRef();
  const invoiceRef = useRef();
  const componentCopyRef = useRef(null);
  const componentAltRef = useRef(null);
  const invButtonRefAlt = useRef();
  const invoiceWrapRef = useRef(null);
  const [cajasMatriz] = useState([
    "Almacen Central",
    "3625-CIF",
    "2389-NZF",
    "2687-SAD",
    "2071-XGP",
    "Multicine LP",
    "Multicine EA",
    "Ferias",
  ]);
  const [idsMatriz] = useState([
    "AL001",
    "3625-CIF",
    "2389-NZF",
    "2687-SAD",
    "2071-XGP",
    "AG011",
    "AG012",
    "AG013",
  ]);
  const pagosArray = [
    "Efectivo",
    "Tarjeta",
    "Cheque",
    "Vales",
    "Otros",
    "Pago Posterior",
    "Transferencia",
    "Depósito en Cuenta",
    "Transferencia Swift",
    "Efectivo - Tarjeta",
  ];
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      const idAg = JSON.parse(UsuarioAct).idAlmacen;
      setIdAgencia(idAg);
      const mobilepdvdata = getSalePointsAndStores(idAg);
      mobilepdvdata.then((res) => {
        console.log("Datos obtenidos", res);
        const dataArray = [];
        if (idAg == "AL001") {
          setIdAgencia(idAg);
          res.data.map((data) => {
            const obj = {
              pdv: data.nroPuntoDeVenta,
              nombre: cajasMatriz[data.nroPuntoDeVenta],
              id: idsMatriz[data.nroPuntoDeVenta],
            };
            dataArray.push(obj);
          });
          setPdvList(dataArray);
        } else {
          res.data.map((data) => {
            const obj = {
              pdv: data.nroPuntoDeVenta,
              nombre: `Caja ${data.nroPuntoDeVenta + 1}`,
            };
            dataArray.push(obj);
          });
          setPdvList(dataArray);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isDownloadable) {
      invButtonRefAlt.current.click();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isDownloadable]);

  function getInvoiceDetails(e) {
    e.preventDefault();
    console.log("Punto de venta", pdv);
    console.log("Agencia", idAgencia);
    if (pdv === "") {
      setAlert("Seleccione un punto de venta");
      setIsAlert(true);
    } else {
      if (nroFactura == "") {
        setAlert("Ingrese un nro de Factura");
        setIsAlert(true);
      } else {
        const data = getInvoiceToRePrint(idAgencia, pdv, nroFactura);
        data.then((res) => {
          console.log("Datos de la factura:", res);
          const dataObj = {
            nitCliente: res.data[0].nitCliente,
            razonSocial: res.data[0].razonSocial,
            montoFacturar: res.data[0].montoFacturar,
            fechaHora: res.data[0].fechaHora,
          };
          setInvoiceData(dataObj);
          setFullInvData(res.data[0]);
          setIsInvoice(true);
          const productsArray = [];
          res.data.map((product) => {
            const prodObj = {
              total: product.totalProd,
              cantProducto: product.cantidadProducto,
              nombreProducto: product.nombreProducto,
              precioDeFabrica: parseFloat(
                parseFloat(product.totalProd) /
                  parseFloat(product.cantidadProducto)
              ).toFixed(2),
              descuentoProd: product.descuentoProducto,
            };
            productsArray.push(prodObj);
          });
          setSelectedProducts(productsArray);
        });
      }
    }
  }
  const handleClose = () => {
    setIsAlert(false);
  };
  function clearData(e) {
    e.preventDefault();
    setIsInvoice(false);
    setPdv("");
    setNroFactura("");
  }
  function printInvoice(e) {
    console.log("Imprimiendo");
    e.preventDefault();
    setIsFactura(true);
  }
  useEffect(() => {
    if (isFactura) {
      if (invoiceRef.current) {
        invoiceRef.current.click();
      }
    }
  }, [isFactura]);

  const handleDownloadPdfInv = async () => {
    console.log("Flag 1");
    const element = componentAltRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    console.log("Flag 2");
    const elementCopy = componentCopyRef.current;
    const canvasCopy = await html2canvas(elementCopy);
    const dataCopy = canvasCopy.toDataURL("image/png");
    console.log("Flag 3");
    const node = invoiceWrapRef.current;
    const { height } = node.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mmHeight = height / ((dpr * 96) / 25.4);
    console.log("Height in mm:", mmHeight);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [85, 300 + selectedProducts.length * 10],
    });

    const imgProperties = pdf.getImageProperties(data);
    const imgPropertiesCopy = pdf.getImageProperties(dataCopy);

    const pdfWidth = 78;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    const pdfHeightCopy =
      (imgPropertiesCopy.height * pdfWidth) / imgPropertiesCopy.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(dataCopy, "PNG", 0, 0, pdfWidth, pdfHeightCopy);
    pdf.save(`factura-${nroFactura}-${fullInvData.nitCliente}.pdf`);
    console.log("Llego aca");
  };

  function handlePdv(value) {
    const data = JSON.parse(value);
    if (data.id) {
      if (data.id != idAgencia) {
        setIdAgencia(data.id);
      }
    }
    setPdv(data.pdv);
  }

  return (
    <div>
      <Modal show={isInvoice} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Datos de la Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>
              <tr>
                <th>Nro Factura</th>
                <td>{nroFactura}</td>
              </tr>
              <tr>
                <th>Nit Cliente</th>
                <td>{invoiceData.nitCliente}</td>
              </tr>
              <tr>
                <th>Razon Social</th>
                <td>{invoiceData.razonSocial}</td>
              </tr>
              <tr>
                <th>Monto Facturado</th>
                <td>{`${parseFloat(invoiceData.montoFacturar).toFixed(
                  2
                )} Bs`}</td>
              </tr>
              <tr>
                <th>Fecha y hora</th>
                <td>{invoiceData.fechaHora}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={(e) => printInvoice(e)}>
            Imprimir
          </Button>
          <Button
            variant="warning"
            onClick={(e) => {
              clearData(e);
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Confirmo, cerrar Mensaje del Sistema
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <div className="formLabel">RE IMPRIMIR FACTURAS</div>
        <Form>
          <Form.Label>Seleccione punto de venta</Form.Label>
          <Form.Select
            onChange={(e) => {
              handlePdv(e.target.value);
            }}
          >
            <option>- Seleccione una opcion -</option>
            {pdvList.map((pdv, index) => {
              return (
                <option value={JSON.stringify(pdv)} key={index}>
                  {pdv.nombre}
                </option>
              );
            })}
          </Form.Select>
          <div className="formLabel">Seleccionar factura</div>
          <Form.Group>
            <Form.Label>Ingrese Nro de Factura</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => {
                setNroFactura(e.target.value);
              }}
              value={nroFactura}
            />
          </Form.Group>
          <div className="formLabel"></div>
          <Form.Group className="reportButtonGroup">
            <Button variant="success" onClick={(e) => getInvoiceDetails(e)}>
              Obtener Datos de Factura
            </Button>
            <Button variant="warning" onClick={(e) => clearData(e)}>
              Limpiar Todo
            </Button>
          </Form.Group>
        </Form>
        {isFactura ? (
          <div>
            <ReactToPrint
              trigger={() => (
                <button ref={invoiceRef} hidden>
                  Print this out!
                </button>
              )}
              content={() => componentRef.current}
              onAfterPrint={() => {
                setIsDownloadable(true);
              }}
            />
            <Button hidden>
              <InvoiceComponent
                ref={componentRef}
                branchInfo={{
                  nombre: fullInvData.nombre,
                  tel: fullInvData.telefono,
                  dir: fullInvData.direccion,
                  ciudad: fullInvData.ciudad,
                  nro: fullInvData.idImpuestos,
                }}
                selectedProducts={selectedProducts}
                cuf={fullInvData.cuf}
                invoice={{
                  nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                  nroFactura: fullInvData.nroFactura,
                  razonSocial: fullInvData.razonSocial,
                  nitCliente: fullInvData.nitCliente,
                }}
                paymentData={{
                  tipoPago: pagosArray[fullInvData.tipoPago - 1],
                  cancelado: fullInvData.pagado,
                  cambio: fullInvData.cambio,
                  fechaHora: fullInvData.fechaHora,
                }}
                totalsData={{
                  total: fullInvData.montoTotal,
                  descuentoCalculado: fullInvData.descuentoCalculado,
                  totalDescontado: fullInvData.montoFacturar,
                }}
                invoiceNumber={fullInvData.nroFactura}
                giftCard={fullInvData.vale}
                isOrder={true}
              />
            </Button>
          </div>
        ) : null}
      </div>
      {isDownloadable ? (
        <div>
          <button
            hidden
            type="button"
            onClick={handleDownloadPdfInv}
            ref={invButtonRefAlt}
          >
            Download as PDF
          </button>
          <div ref={invoiceWrapRef}>
            <InvoiceComponentAlt
              ref={componentAltRef}
              branchInfo={{
                nombre: fullInvData.nombre,
                tel: fullInvData.telefono,
                dir: fullInvData.direccion,
                ciudad: fullInvData.ciudad,
                nro: fullInvData.idImpuestos,
              }}
              selectedProducts={selectedProducts}
              cuf={fullInvData.cuf}
              invoice={{
                nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                nroFactura: fullInvData.nroFactura,
                razonSocial: fullInvData.razonSocial,
                nitCliente: fullInvData.nitCliente,
              }}
              paymentData={{
                tipoPago: pagosArray[fullInvData.tipoPago - 1],
                cancelado: fullInvData.pagado,
                cambio: fullInvData.cambio,
                fechaHora: fullInvData.fechaHora,
              }}
              totalsData={{
                total: fullInvData.montoTotal,
                descuentoCalculado: fullInvData.descuentoCalculado,
                totalDescontado: fullInvData.montoFacturar,
              }}
              giftCard={fullInvData.vale}
              isOrder={true}
            />
            <InvoiceComponentCopy
              ref={componentCopyRef}
              branchInfo={{
                nombre: fullInvData.nombre,
                tel: fullInvData.telefono,
                dir: fullInvData.direccion,
                ciudad: fullInvData.ciudad,
                nro: fullInvData.idImpuestos,
              }}
              selectedProducts={selectedProducts}
              cuf={fullInvData.cuf}
              invoice={{
                nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                nroFactura: fullInvData.nroFactura,
                razonSocial: fullInvData.razonSocial,
                nitCliente: fullInvData.nitCliente,
              }}
              paymentData={{
                tipoPago: pagosArray[fullInvData.tipoPago - 1],
                cancelado: fullInvData.pagado,
                cambio: fullInvData.cambio,
                fechaHora: fullInvData.fechaHora,
              }}
              totalsData={{
                total: fullInvData.montoTotal,
                descuentoCalculado: fullInvData.descuentoCalculado,
                totalDescontado: fullInvData.montoFacturar,
              }}
              giftCard={fullInvData.vale}
              isOrder={true}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
