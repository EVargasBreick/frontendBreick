import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import InvoicePDF from "./invoicePDF";
import QrComponent from "./qrComponent";
import loading2 from "../assets/loading2.gif";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { getInvoiceNumber, structureXml } from "../services/mockedServices";
import { SoapInvoice } from "../Xml/soapInvoice";
import xml2js from "xml2js";
import { SoapInvoiceTransaction } from "../Xml/soapInvoiceTransaction";
import { dateString } from "../services/dateServices";
import { registerDrop } from "../services/dropServices";
import { updateStock } from "../services/orderServices";
import { DropComponent } from "./dropComponent";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { InvoiceComponentAlt } from "./invoiceComponentAlt";
import { InvoiceComponentCopy } from "./invoiceComponentCopy";
export default function SaleModal({
  datos,
  show,
  setDescuento,
  isSaleModal,
  setIsSaleModal,
  setIsInvoice,
  tipoPago,
  setTipoPago,
  setCambio,
  cambio,
  cancelado,
  setCancelado,
  cardNumbersA,
  setCardNumbersA,
  cardNumbersB,
  setCardNumbersB,
  saveInvoice,
  setAlert,
  setIsAlert,
  branchInfo,
  selectedProducts,
  invoice,
  total,
  descuentoCalculado,
  totalDescontado,
  fechaHora,
  tipoDocumento,
  userName,
  pointOfSale,
  otherPayments,
  userStore,
  userId,
  saleType,
}) {
  const numberARef = useRef();
  const numberBRef = useRef();
  const canceledRef = useRef();
  const [stringPago, setStringPago] = useState("");
  const [isFactura, setIsFactura] = useState(false);
  const invoiceRef = useRef();
  const [alertSec, setAlertSec] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [cuf, setCuf] = useState("");
  const [invoiceMod, setInvoceMod] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const componentRef = useRef();
  const [approvedId, setApprovedId] = useState("");
  const [ofp, setOfp] = useState(0);
  const [giftCard, setGiftCard] = useState(0);
  const [aPagar, setAPagar] = useState(0);
  const [motivo, setMotivo] = useState("");
  const [isDrop, setIsDrop] = useState(false);
  const [dropId, setDropId] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [invoiceHeight, setInvoiceHeight] = useState("");
  const dropRef = useRef();
  const dropButtonRef = useRef();
  const invButtonRef = useRef();
  const invoiceWrapRef = useRef(null);
  const componentCopyRef = useRef(null);
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  const isMobile = isMobileDevice();
  useEffect(() => {
    if (cuf.length > 0) {
      setIsFactura(true);
      setInvoceMod(true);
    }
  }, [cuf]);
  useEffect(() => {
    if (isFactura && !isMobile) {
      const node = invoiceWrapRef.current;
      if (node) {
        const { height } = node.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const mmHeight = height / ((dpr * 96) / 25.4);
        console.log("Height in mm:", mmHeight);
        setInvoiceHeight(mmHeight);
      }
    }
  }, [isFactura]);
  useEffect(() => {
    if (isFactura) {
      if (invoiceRef.current) {
        invoiceRef.current.click();
      } else {
        invButtonRef.current.click();
      }
    }
    if (isDrop) {
      if (invoiceRef.current) {
        invoiceRef.current.click();
      } else {
        dropButtonRef.current.click();
      }
    }
  }, [isFactura, isDrop]);
  useEffect(() => {
    setCambio(
      Math.abs((cancelado - (datos.totalDescontado - giftCard)).toFixed(2))
    );
  }, [cancelado]);

  useEffect(() => {
    if (isSaved) {
      window.location.reload();
    }
  }, [isSaved]);

  useEffect(() => {
    const canceled = (datos.totalDescontado - giftCard).toFixed(2);
    setCancelado(canceled < 0 ? 0 : canceled);
    setCambio(0);
  }, [giftCard]);

  useEffect(() => {
    if (tipoPago == 1) {
      canceledRef.current.focus();
    }
    if (tipoPago == 2) {
      numberARef.current.focus();
    }
    if (tipoPago == 10) {
      canceledRef.current.focus();
    }
  }, [tipoPago]);
  function handleCardNumber(number, card) {
    if (card == "A") {
      if (number <= 9999) {
        setCardNumbersA(number);
      }
      if (number.length == 4) {
        numberBRef.current.focus();
      }
    } else {
      if (number <= 9999) {
        setCardNumbersB(number);
      }
    }
  }
  function handleTipoPago(value) {
    setTipoPago(value);
    switch (value) {
      case "1":
        setStringPago("Efectivo");
        setCardNumbersA("");
        setCardNumbersB("");
        setOfp(0);
        setCancelado("");
        break;
      case "2":
        setStringPago("Tarjeta");
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setOfp(0);
        break;
      case "3":
        setStringPago("Cheque");
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "4":
        setStringPago("Vales");
        setCancelado(0);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "5":
        setStringPago("Otros");
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "6":
        setStringPago("Pago Posterior");
        setAPagar(1);
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "7":
        setStringPago("Transferencia");
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "8":
        setStringPago("Deposito");
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "9":
        setStringPago("Transferencia Swift");
        setCancelado(datos.totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "10":
        setStringPago("Efectivo-tarjeta");
        setCancelado(datos.totalDescontado.toFixed(2));
        setOfp(0);
        setCambio(0);
        break;
      case "11":
        setStringPago("Baja");
        setDescuento(0);
        setCancelado(0);
        setOfp(0);
        setCambio(0);
        break;
    }
  }
  function validateFormOfPayment(e) {
    e.preventDefault();
    return new Promise((resolve) => {
      if (tipoPago == 0) {
        setAlert("Seleccione un metodo de pago");
        setIsAlert(true);
      } else {
        if (tipoPago == 1) {
          console.log("Cancelado", cancelado, datos.totalDescontado);
          if (
            cancelado == 0 ||
            !parseFloat(cancelado).toFixed(2) >=
              parseFloat(datos.totalDescontado).toFixed(2)
          ) {
            setAlert("Ingrese un monto mayor o igual al monto de la compra");
            setIsAlert(true);
          } else {
            invoiceProcess();
          }
        } else {
          if (tipoPago == 2 || tipoPago == 10) {
            if (cardNumbersA.length < 4 || cardNumbersB.length < 4) {
              setAlert("Ingrese valores válidos para la tarjeta por favor");
              setIsAlert(true);
            } else {
              invoiceProcess();
            }
          }
          if (tipoPago == 4) {
            if (giftCard == 0) {
              setAlert("Ingrese un valor válido para el vale");
              setIsAlert(true);
            } else {
              if (cancelado - (datos.totalDescontado - giftCard) < 0) {
                setAlert("Ingrese un valor mayor al saldo");
                setIsAlert(true);
              } else {
                invoiceProcess();
              }
            }
          }
          if (
            tipoPago == 3 ||
            tipoPago == 5 ||
            tipoPago == 6 ||
            tipoPago == 7 ||
            tipoPago == 8 ||
            tipoPago == 9
          ) {
            invoiceProcess();
          }
          if (tipoPago == 11) {
            setAlertSec("Guardando baja");
            setIsAlertSec(true);
            const objStock = {
              accion: "take",
              idAlmacen: userStore,
              productos: selectedProducts,
            };
            const objBaja = {
              motivo: motivo,
              fechaBaja: dateString(),
              idUsuario: userId,
              idAlmacen: userStore,
              productos: selectedProducts,
            };

            const bajaRegistrada = registerDrop(objBaja);
            bajaRegistrada
              .then((res) => {
                setDropId(res.data.id);
                const updatedStock = updateStock(objStock);
                updatedStock
                  .then((res) => {
                    setIsAlertSec(false);

                    setIsDrop(true);
                  })
                  .catch((err) => {
                    console.log("Error al updatear stock", err);
                  });
              })
              .catch((err) => {
                console.log("error al registrar la baja", err);
              });
          }
        }
      }
      resolve(true);
    });
  }
  async function invoiceProcess() {
    setAlertSec("Generando información de última factura");
    setIsAlertSec(true);
    const lastIdObj = {
      nit: invoice.nitEmpresa,
      puntoDeVentaId: branchInfo.nro,
      tipoComprobante: 1,
      caja: pointOfSale,
    };
    const newId = getInvoiceNumber(lastIdObj);
    newId
      .then((res) => {
        setInvoiceId(res.response.data + 1);
        setAlertSec(`Última factura: ${res.response.data}`);
        setTimeout(() => {
          setAlertSec("Generando Codigo Único de Facturación");
        }, 1500);
        const xmlRes = structureXml(
          selectedProducts,
          branchInfo,
          tipoPago,
          totalDescontado,
          descuentoCalculado,
          invoice,
          res.response.data + 1,
          `${cardNumbersA}00000000${cardNumbersB}`,
          userName,
          tipoDocumento,
          pointOfSale,
          giftCard
        );
        console.log("Productos seleccionados", selectedProducts);
        xmlRes.then((resp) => {
          const lineal = resp.replace(/ {4}|[\t\n\r]/gm, "");
          const cufObj = {
            nit: invoice.nitEmpresa,
            idSucursal: branchInfo.nro,
            tipoComprobante: 1,
            formatoId: process.env.REACT_APP_FORMATO_ID,
            XML: lineal,
            caja: pointOfSale,
          };
          const comprobante = SoapInvoice(cufObj);
          comprobante
            .then((res) => {
              console.log(
                "Resultado de la validacion del comprobante",
                res.response.data
              );
              xml2js.parseString(res.response.data, (err, result) => {
                setApprovedId(result.SalidaTransaccion.Transaccion[0].ID[0]);
                const transacObj = {
                  nit: invoice.nitEmpresa,
                  id: result.SalidaTransaccion.Transaccion[0].ID[0],
                };
                const idTransaccion =
                  result.SalidaTransaccion.Transaccion[0].ID[0];
                var intento = 1;
                let intervalId = setInterval(function () {
                  const transaccion = SoapInvoiceTransaction(transacObj);
                  transaccion
                    .then((resp) => {
                      console.log(
                        "Respuesta de la transaccion",
                        resp.response.data.SalidaTransaccionBoliviaResponse[0]
                          .SalidaTransaccionBoliviaResult[0]
                      );
                      const invocieResponse =
                        resp.response.data.SalidaTransaccionBoliviaResponse[0]
                          .SalidaTransaccionBoliviaResult[0]
                          .TransaccionSalidaUnificada[0];
                      if (invocieResponse?.CUF[0].length > 10) {
                        setAlertSec("Generando Factura");
                        const resCuf = invocieResponse.CUF[0];

                        const resCufd = invocieResponse.CUFD[0];
                        const aut = invocieResponse.Autorizacion[0];
                        const fe = invocieResponse.FECHAEMISION[0];
                        const numFac = invocieResponse.NumeroFactura[0];

                        const saved = saveInvoice(
                          resCuf,
                          resCufd,
                          aut,
                          fe,
                          numFac,
                          idTransaccion,
                          ofp,
                          giftCard,
                          aPagar
                        );
                        saved.then((res) => {
                          setCuf(resCuf);

                          setIsAlertSec(false);
                        });
                        clearInterval(intervalId);
                      } else {
                        intento += 1;
                        setAlertSec("Generando Codigo Único de Facturación");
                      }
                    })
                    .catch((error) => {
                      console.log("Esto paso", error);
                    });
                }, 5000);
              });
            })
            .catch((err) => console.log("Esto paso", err));
        });
      })
      .catch((err) => {
        console.log("Error al obtener el id", err);
      });
  }
  function handleClose() {
    setDescuento(0);
    setIsInvoice(false);
    setIsSaleModal(false);
  }
  const handleDownloadPdfInv = async () => {
    console.log("Heigth in the function", invoiceHeight);
    const element = componentRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const elementCopy = componentCopyRef.current;
    const canvasCopy = await html2canvas(elementCopy);
    const dataCopy = canvasCopy.toDataURL("image/png");

    const node = invoiceWrapRef.current;
    const { height } = node.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mmHeight = height / ((dpr * 96) / 25.4);
    console.log("Height in mm:", mmHeight);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, mmHeight / 2 + 20],
    });

    const imgProperties = pdf.getImageProperties(data);
    const imgPropertiesCopy = pdf.getImageProperties(dataCopy);

    const pdfWidth = 75;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    const pdfHeightCopy =
      (imgPropertiesCopy.height * pdfWidth) / imgPropertiesCopy.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(dataCopy, "PNG", 0, 0, pdfWidth, pdfHeightCopy);
    pdf.save(`factura-${invoiceId}.pdf`);
    setIsSaved(true);
  };

  const handleDownloadPdfDrop = async () => {
    const element = dropRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = 70;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("nota_entrega.pdf");
  };

  return (
    <div>
      <Modal show={isAlertSec}>
        <Modal.Header closeButton>
          <Modal.Title>{alertSec}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={loading2} style={{ width: "5%" }} />
        </Modal.Body>
      </Modal>
      <Modal show={invoiceMod}>
        <Modal.Header>
          <Modal.Title>{`Facturacion`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isMobile ? (
            isFactura ? (
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button ref={invoiceRef} hidden>
                      Print this out!
                    </button>
                  )}
                  content={() => componentRef.current}
                  onAfterPrint={() => window.location.reload()}
                />
                <Button hidden>
                  <InvoiceComponent
                    ref={componentRef}
                    branchInfo={branchInfo}
                    selectedProducts={selectedProducts}
                    cuf={cuf}
                    invoice={invoice}
                    paymentData={{
                      tipoPago: stringPago,
                      cancelado: cancelado,
                      cambio: cambio,
                      fechaHora: fechaHora,
                    }}
                    totalsData={{
                      total: total,
                      descuentoCalculado: descuentoCalculado,
                      totalDescontado: totalDescontado,
                    }}
                  />
                </Button>
              </div>
            ) : null
          ) : isFactura ? (
            <div>
              <button
                hidden
                type="button"
                onClick={handleDownloadPdfInv}
                ref={invButtonRef}
              >
                Download as PDF
              </button>
              <div ref={invoiceWrapRef}>
                <InvoiceComponentAlt
                  ref={componentRef}
                  branchInfo={branchInfo}
                  selectedProducts={selectedProducts}
                  cuf={cuf}
                  invoice={invoice}
                  paymentData={{
                    tipoPago: stringPago,
                    cancelado: cancelado,
                    cambio: cambio,
                    fechaHora: fechaHora,
                  }}
                  totalsData={{
                    total: total,
                    descuentoCalculado: descuentoCalculado,
                    totalDescontado: totalDescontado,
                  }}
                />
                <InvoiceComponentCopy
                  ref={componentCopyRef}
                  branchInfo={branchInfo}
                  selectedProducts={selectedProducts}
                  cuf={cuf}
                  invoice={invoice}
                  paymentData={{
                    tipoPago: stringPago,
                    cancelado: cancelado,
                    cambio: cambio,
                    fechaHora: fechaHora,
                  }}
                  totalsData={{
                    total: total,
                    descuentoCalculado: descuentoCalculado,
                    totalDescontado: totalDescontado,
                  }}
                />
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
      {!isMobile ? (
        isDrop ? (
          <div>
            <ReactToPrint
              trigger={() => (
                <button ref={invoiceRef} hidden>
                  Print this out!
                </button>
              )}
              content={() => dropRef.current}
              onAfterPrint={() => window.location.reload()}
            />
            <Button>
              <DropComponent
                ref={dropRef}
                branchInfo={branchInfo}
                selectedProducts={selectedProducts}
                cliente={{
                  nit: invoice.nitCliente,
                  razonSocial: invoice.razonSocial,
                }}
                dropId={dropId}
              />
            </Button>
          </div>
        ) : null
      ) : isDrop ? (
        <div>
          <button
            hidden
            type="button"
            onClick={handleDownloadPdfDrop}
            ref={dropButtonRef}
          >
            Download as PDF
          </button>
          <DropComponent
            ref={dropRef}
            branchInfo={branchInfo}
            selectedProducts={selectedProducts}
            cliente={{
              nit: invoice.nitCliente,
              razonSocial: invoice.razonSocial,
            }}
            dropId={dropId}
          />
        </div>
      ) : null}

      <Modal show={isSaleModal} size="lg">
        <Modal.Header className="modalHeader">
          <Modal.Title>Facturar</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bodyModal">
          <div className="modalRows">
            <div className="modalLabel"> Nit:</div>
            <div className="modalData">{`${datos.nit}`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Razon Social:</div>
            <div className="modalData">{`${datos.razonSocial}`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Total:</div>
            <div className="modalData">{`${parseFloat(datos.total).toFixed(
              2
            )} Bs.`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Descuento:</div>
            <div className="modalData">
              {descuentoCalculado > 0
                ? descuentoCalculado
                : `${parseFloat(datos.descuento).toFixed(2)} %`}
            </div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Total a pagar:</div>
            <div className="modalData">{`${parseFloat(
              datos.totalDescontado
            ).toFixed(2)} Bs.`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Tipo de pago:</div>
            <div className="modalData">
              <Form>
                <Form.Select
                  onChange={(e) => handleTipoPago(e.target.value)}
                  value={tipoPago}
                >
                  <option>Seleccione tipo de pago</option>
                  <option value="1">Efectivo</option>
                  <option value="2">Tarjeta</option>
                  <option value="3">Cheque</option>
                  <option value="4">Vales</option>
                  <option value="5">Otros</option>
                  <option value="6">Pago Posterior</option>
                  <option value="7">Transferencia</option>
                  <option value="8">Deposito en cuenta</option>
                  <option value="9">Transferencia Swift</option>
                  <option value="10">Efectivo - Tarjeta</option>
                  <option value="11">Baja</option>
                </Form.Select>
              </Form>
            </div>
          </div>
          {tipoPago == 5 ? (
            <div>
              <div className="modalRows">
                <div className="modalLabel"> Otro Tipo de pago:</div>
                <div className="modalData">
                  <Form>
                    <Form.Select
                      onChange={(e) => setOfp(e.target.value)}
                      value={ofp}
                    >
                      <option>Seleccione Otro Tipo </option>
                      {otherPayments.map((op, index) => {
                        return (
                          <option value={op.idOtroPago} key={index}>
                            {op.otroPago}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form>
                </div>
              </div>
            </div>
          ) : null}

          {tipoPago == 1 ? (
            <div>
              <div className="modalRows">
                <div className="modalLabel"> Monto cancelado:</div>
                <div className="modalData">
                  <Form>
                    <Form.Control
                      ref={canceledRef}
                      value={cancelado}
                      type="number"
                      onChange={(e) => setCancelado(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? validateFormOfPayment(e) : null
                      }
                    />
                  </Form>
                </div>
              </div>
              <div className="modalRows">
                <div className="modalLabel"> Cambio:</div>
                <div className="modalData">{`${
                  cancelado - datos.totalDescontado < 0
                    ? " Ingrese un monto igual o superior"
                    : `${(cancelado - datos.totalDescontado).toFixed(2)} Bs.`
                } `}</div>
              </div>
            </div>
          ) : tipoPago == 2 ? (
            <div className="modalRows">
              <div className="modalLabel"> Numeros tarjeta:</div>
              <div className="modalData">
                {
                  <Form className="cardLayout">
                    <Form.Control
                      ref={numberARef}
                      type="text"
                      onChange={(e) => handleCardNumber(e.target.value, "A")}
                      value={cardNumbersA}
                    ></Form.Control>
                    <div className="modalHyphen">{"-"}</div>
                    <Form.Control
                      ref={numberBRef}
                      min="0000"
                      max="9999"
                      type="number"
                      onChange={(e) => handleCardNumber(e.target.value, "B")}
                      value={cardNumbersB}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? validateFormOfPayment(e) : null
                      }
                    ></Form.Control>
                  </Form>
                }
              </div>
            </div>
          ) : tipoPago == 10 ? (
            <div>
              <div className="modalRows">
                <div className="modalLabel"> Monto cancelado:</div>
                <div className="modalData">
                  <Form>
                    <Form.Control
                      ref={canceledRef}
                      value={cancelado}
                      type="number"
                      onChange={(e) => setCancelado(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? validateFormOfPayment(e) : null
                      }
                    />
                  </Form>
                </div>
              </div>
              <div className="modalRows">
                <div className="modalLabel"> A cobrar con tarjeta:</div>
                <div className="modalData">{`${(
                  -cancelado + datos.totalDescontado
                ).toFixed(2)} Bs.`}</div>
              </div>
              <div className="modalRows">
                <div className="modalLabel"> Numeros tarjeta:</div>
                <div className="modalData">
                  {
                    <Form className="cardLayout">
                      <Form.Control
                        ref={numberARef}
                        type="text"
                        onChange={(e) => handleCardNumber(e.target.value, "A")}
                        value={cardNumbersA}
                      ></Form.Control>
                      <div className="modalHyphen">{"-"}</div>
                      <Form.Control
                        ref={numberBRef}
                        min="0000"
                        max="9999"
                        type="number"
                        onChange={(e) => handleCardNumber(e.target.value, "B")}
                        value={cardNumbersB}
                        onKeyDown={(e) =>
                          e.key === "Enter" ? validateFormOfPayment(e) : null
                        }
                      ></Form.Control>
                    </Form>
                  }
                </div>
              </div>
            </div>
          ) : null}
          {tipoPago == 4 ? (
            <div>
              <div className="modalRows">
                <div className="modalLabel"> Valor del Vale:</div>
                <div className="modalData">
                  <Form>
                    <Form.Control
                      ref={canceledRef}
                      value={giftCard}
                      type="number"
                      onChange={(e) => setGiftCard(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? validateFormOfPayment(e) : null
                      }
                    />
                  </Form>
                </div>
              </div>
              <div className="modalRows">
                <div className="modalLabel"> A pagar en efectivo:</div>
                <div className="modalData">{`${
                  giftCard - datos.totalDescontado > 0
                    ? "El valor del Vale es mayor al monto de la compra"
                    : `${(-giftCard + datos.totalDescontado).toFixed(2)} Bs.`
                } `}</div>
              </div>
              {datos.totalDescontado - giftCard > 0 ? (
                <div>
                  <div className="modalRows">
                    <div className="modalLabel"> Cancelado:</div>
                    <div className="modalData">
                      <Form>
                        <Form.Control
                          ref={canceledRef}
                          value={cancelado}
                          type="number"
                          onChange={(e) => setCancelado(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" ? validateFormOfPayment(e) : null
                          }
                        />
                      </Form>
                    </div>
                  </div>
                  <div className="modalRows">
                    <div className="modalLabel"> Cambio:</div>
                    <div className="modalData">{`${
                      parseFloat(cancelado).toFixed(2) -
                        parseFloat(datos.totalDescontado - giftCard).toFixed(
                          2
                        ) <=
                      0
                        ? "Test"
                        : `${(
                            cancelado -
                            (datos.totalDescontado - giftCard)
                          ).toFixed(2)} Bs.`
                    } `}</div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          {tipoPago == 11 ? (
            <div className="modalRows">
              <div className="modalLabel"> Motivo de la Baja:</div>
              <div className="modalData">
                {
                  <Form className="cardLayout">
                    <Form.Select onChange={(e) => setMotivo(e.target.value)}>
                      <option>Seleccione Motivo</option>
                      <option value="socio">Socio</option>
                      <option value="vale">Vale</option>
                      <option value="promo">Promoción</option>
                      <option value="muestra">Muestra</option>
                    </Form.Select>
                  </Form>
                }
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={(e) => validateFormOfPayment(e)}>
            Facturar
          </Button>
          <Button variant="danger" onClick={() => handleClose()}>
            {" "}
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
