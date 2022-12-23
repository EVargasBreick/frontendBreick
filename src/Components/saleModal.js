import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import InvoicePDF from "./invoicePDF";
import QrComponent from "./qrComponent";
import loading2 from "../assets/loading2.gif";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { generateCuf, getInvoiceNumber } from "../services/mockedServices";
export default function SaleModal({
  datos,
  show,
  isSaleModal,
  setIsSaleModal,
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
}) {
  const numberARef = useRef();
  const numberBRef = useRef();
  const [stringPago, setStringPago] = useState("");
  const [isFactura, setIsFactura] = useState(false);
  const invoiceRef = useRef();
  const [alertSec, setAlertSec] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [cuf, setCuf] = useState("");
  const [invoiceMod, setInvoceMod] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const componentRef = useRef();
  useEffect(() => {
    if (cuf.length > 0) {
      console.log("Correr esto cuando exista cuf");
      setIsFactura(true);
      setInvoceMod(true);
    }
  }, [cuf]);
  useEffect(() => {
    if (isFactura) {
      console.log("Esto deberia correr una vez que existe el cuf");
      invoiceRef.current.click();
    }
  }, [isFactura]);
  useEffect(() => {
    setCambio((cancelado - datos.totalDescontado).toFixed(2));
  }, [cancelado]);
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
    if (value == 1) {
      setStringPago("Efectivo");
      setCardNumbersA("");
      setCardNumbersB("");
    } else {
      setStringPago("Tarjeta");
      setCancelado(datos.totalDescontado);
      setCambio(0);
    }
  }
  function validateFormOfPayment() {
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
          if (cardNumbersA.length < 4 || cardNumbersB.length < 4) {
            setAlert("Ingrese valores válidos para la tarjeta por favor");
            setIsAlert(true);
          } else {
            invoiceProcess();
          }
        }
      }
      resolve(true);
    });
  }
  async function invoiceProcess() {
    setAlertSec("Generando informacion de ultima factura");
    setIsAlertSec(true);
    const newId = getInvoiceNumber();
    newId.then((res) => {
      setInvoiceId(res);
      setAlertSec("Generando CUF");
      const cufd = generateCuf(res);
      cufd.then((resp) => {
        console.log("Cuf generado:", resp);
        const saved = saveInvoice(resp, res);
        setCuf(resp);
        saved.then((res) => {
          console.log("Se renderizo la factura?", isFactura);
          setIsAlertSec(false);
        });
      });
    });
  }
  function downloadAndRedirect() {
    invoiceRef.current.click();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
                </Form.Select>
              </Form>
            </div>
          </div>
          {tipoPago == 1 ? (
            <div>
              <div className="modalRows">
                <div className="modalLabel"> Monto cancelado:</div>
                <div className="modalData">
                  <Form>
                    <Form.Control
                      value={cancelado}
                      type="text"
                      onChange={(e) => setCancelado(e.target.value)}
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
                    ></Form.Control>
                  </Form>
                }
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={() => validateFormOfPayment()}>
            Facturar
          </Button>
          <Button variant="danger" onClick={() => setIsSaleModal(false)}>
            {" "}
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
