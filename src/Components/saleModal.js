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
  useEffect(() => {
    if (cuf.length > 0) {
      console.log("Correr esto cuando exista cuf");
      setIsFactura(true);
      setInvoceMod(true);
    }
    console.log("Point of sale in the modal", pointOfSale);
  }, [cuf]);
  useEffect(() => {
    if (isFactura) {
      console.log("Esto deberia correr una vez que existe el cuf");
      invoiceRef.current.click();
    }
  }, [isFactura]);
  useEffect(() => {
    setCambio(
      Math.abs((cancelado - (datos.totalDescontado - giftCard)).toFixed(2))
    );
  }, [cancelado]);

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
          if ((cancelado = 0 || cancelado < datos.totalDescontado)) {
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
        }
      }
      resolve(true);
    });
  }
  async function invoiceProcess() {
    setAlertSec("Generando información de última factura");
    console.log("Branch info", branchInfo);
    setIsAlertSec(true);
    const lastIdObj = {
      nit: invoice.nitEmpresa,
      puntoDeVentaId: branchInfo.nro,
      tipoComprobante: 1,
    };
    const newId = getInvoiceNumber(lastIdObj);
    newId
      .then((res) => {
        console.log("ULTIMO NUMERO COMPROBANTE", res.response.data);
        setInvoiceId(res);
        setInvoiceId(res);
        setAlertSec("Generando Codigo Único de Facturación");
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
        xmlRes.then((resp) => {
          const lineal = resp.replace(/ {4}|[\t\n\r]/gm, "");
          const cufObj = {
            nit: invoice.nitEmpresa,
            idSucursal: branchInfo.nro,
            tipoComprobante: 1,
            formatoId: process.env.REACT_APP_FORMATO_ID,
            XML: lineal,
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
                      if (invocieResponse.CUF[0].length > 10) {
                        setAlertSec("Generando Factura");
                        const resCuf = invocieResponse.CUF[0];
                        console.log("Rescuf:", resCuf);
                        const resCufd = invocieResponse.CUFD[0];
                        const aut = invocieResponse.Autorizacion[0];
                        const fe = invocieResponse.FECHAEMISION[0];
                        const numFac = invocieResponse.NumeroFactura[0];
                        console.log("guardando factura ", intento);
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
                          console.log("Se renderizo la factura?", isFactura);
                          setIsAlertSec(false);
                        });
                        clearInterval(intervalId);
                      } else {
                        intento += 1;
                        setAlertSec("Generando Codigo Único de Facturación");
                        console.log("Testeando cuf", invocieResponse.CUF);
                      }
                    })
                    .catch((error) => {
                      console.log("Esto paso", error);
                    });
                }, 7000);
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
          {isFactura ? (
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
          ) : null}
        </Modal.Body>
      </Modal>
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
            <div className="modalData">{`${parseFloat(datos.descuento).toFixed(
              2
            )} %`}</div>
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
                    ? "Ingrese un monto igual o superior"
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
                      cancelado - (datos.totalDescontado - giftCard) < 0
                        ? "Ingrese un monto igual o superior"
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
