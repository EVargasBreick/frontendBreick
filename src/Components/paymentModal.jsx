import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { getBranches } from "../services/storeServices";
import loading2 from "../assets/loading2.gif";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { structureXml, getInvoiceNumber } from "../services/mockedServices";
import { dateString } from "../services/dateServices";

import "../styles/generalStyle.css";
import { saveInvoice } from "../services/invoiceServices";

export default function PaymentModal({
  setIsInvoice,
  isSaleModal,
  setIsSaleModal,
  setAlert,
  isAlert,
  setIsAlert,
  totales,
  cliente,
  setCliente,
  selectedProducts,
  idAlmacen,
}) {
  const numberARef = useRef();
  const numberBRef = useRef();
  const [stringPago, setStringPago] = useState("");
  const [isFactura, setIsFactura] = useState(false);
  const invoiceRef = useRef();
  const [alertSec, setAlertSec] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [cuf, setCuf] = useState("");
  const [isModified, setIsModified] = useState(true);
  const [tipoPago, setTipoPago] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [cancelado, setCancelado] = useState(0);
  const [cardNumbersA, setCardNumbersA] = useState("");
  const [cardNumbersB, setCardNumbersB] = useState("");
  const componentRef = useRef();
  const [branchInfo, setBranchInfo] = useState({});
  const [nit, setNit] = useState(cliente.nit);
  const [razonSocial, setRazonSocial] = useState(cliente.razonSocial);
  const [fechaHora, setFechaHora] = useState("");
  const [desembolsada, setDesembolsada] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  useEffect(() => {
    const suc = getBranches();
    suc.then((resp) => {
      const sucursales = resp.data[0];
      const sucur = sucursales.find((sc) => idAlmacen == sc.idAgencia);
      const branchData = {
        nombre: sucur.nombre,
        dir: sucur.direccion,
        tel: sucur.telefono,
        ciudad: sucur.ciudad,
        idImpuestos: sucur.idImpuestos,
      };
      console.log("Informacion de la sucursal", branchData);
      setBranchInfo(branchData);
    });
  }, []);
  useEffect(() => {
    if (cuf.length > 0) {
      console.log("Correr esto cuando exista cuf");
      setIsFactura(true);
    }
  }, [cuf]);
  useEffect(() => {
    if (isFactura) {
      console.log("Esto deberia correr una vez que existe el cuf");
      invoiceRef.current.click();
    }
  }, [isFactura]);
  useEffect(() => {
    setCambio((cancelado - totales.montoFacturar).toFixed(2));
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
      setCancelado(totales.montoFacturar);
      setCambio(0);
    }
    if (tipoPago == 5) {
      setDesembolsada(1);
    }
  }
  function validateFormOfPayment() {
    return new Promise((resolve) => {
      if (tipoPago == 0) {
        setAlert("Seleccione un metodo de pago");
        setIsAlert(true);
      } else {
        if (tipoPago == 1) {
          if ((cancelado = 0 || cancelado < totales.montoFacturar)) {
            setAlert("Ingrese un monto mayor o igual al monto de la compra");
            setIsAlert(true);
          } else {
            invoiceProcess();
          }
        } else {
          if (tipoPago == 2) {
            if (cardNumbersA.length < 4 || cardNumbersB.length < 4) {
              setAlert("Ingrese valores válidos para la tarjeta por favor");
              setIsAlert(true);
            } else {
              invoiceProcess();
            }
          } else {
            invoiceProcess();
          }
        }
      }
      resolve(true);
    });
  }

  async function invoiceProcess() {
    setFechaHora(dateString());
    setAlertSec("Generando informacion de ultima factura");
    setIsAlertSec(true);
    const newId = getInvoiceNumber();
    newId.then((res) => {
      setInvoiceNumber(res);
      setAlertSec("Generando CUF");
      const cufd = structureXml(res);
      cufd.then((resp) => {
        console.log("Cuf generado:", resp);
        const saved = saveInvoice(
          resp,
          res + 1,
          branchInfo,
          cliente,
          cancelado,
          cambio,
          cardNumbersA,
          cardNumbersB,
          tipoPago,
          tipoPago == 5 ? 1 : 0,
          totales.montoTotal,
          totales.descuento,
          totales.descuentoCalculado,
          totales.montoFacturar,
          totales.idUsuarioCrea,
          totales.idCliente,
          totales.idPedido,
          selectedProducts,
          fechaHora
        );
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
  function updateClient() {
    setCliente({
      nit: nit,
      razonSocial: razonSocial,
    });
    setIsModified(true);
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
      <Modal show={isSaleModal}>
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
                  invoice={{
                    nroFactura: invoiceNumber,
                    idSucursal: branchInfo.idImpuestos,
                    nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                    fechaHora: fechaHora,
                    nitCliente: cliente.nit,
                    razonSocial: cliente.razonSocial,
                    tipoPago: tipoPago,
                    pagado: cancelado,
                    cambio: cambio,
                    nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
                    cuf: cuf,
                    importeBase: parseFloat(cancelado - cambio).toFixed(2),
                    debitoFiscal: parseFloat(
                      (cancelado - cambio) * 0.13
                    ).toFixed(2),
                    desembolsada: desembolsada,
                  }}
                  paymentData={{
                    tipoPago: stringPago,
                    cancelado: cancelado,
                    cambio: cambio,
                    fechaHora: fechaHora,
                  }}
                  totalsData={{
                    total: totales.montoTotal,
                    descuentoCalculado: totales.descuentoCalculado,
                    totalDescontado: totales.montoFacturar,
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
          <Form>
            <div className="modalRows">
              <div className="modalLabel"> Nit:</div>
              <Form.Control
                type="text"
                placeholder={cliente.nit}
                disabled={isModified}
                onChange={(e) => setNit(e.target.value)}
                value={nit}
              />
            </div>
            <div className="modalRows">
              <div className="modalLabel"> Razon Social:</div>
              <Form.Control
                type="text"
                placeholder={cliente.razonSocial}
                disabled={isModified}
                onChange={(e) => setRazonSocial(e.target.value)}
                value={razonSocial}
              />
            </div>
            <div className="editButton">
              <Button
                variant="warning"
                onClick={() => setIsModified(!isModified)}
              >
                Editar
              </Button>
              <Button variant="success" onClick={() => updateClient()}>
                Guardar
              </Button>
            </div>
          </Form>
          <div className="modalRows">
            <div className="modalLabel"> Total:</div>
            <div className="modalData">{`${parseFloat(
              totales.montoTotal
            ).toFixed(2)} Bs.`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Descuento:</div>
            <div className="modalData">{`${parseFloat(
              totales.descuento
            ).toFixed(2)} %`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Total a pagar:</div>
            <div className="modalData">{`${parseFloat(
              totales.montoFacturar
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
                  <option value="3">Transferencia</option>
                  <option value="4">Qr</option>
                  <option value="5">A crédito</option>
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
                      type="number"
                      onChange={(e) =>
                        setCancelado(parseFloat(e.target.value).toFixed)
                      }
                    />
                  </Form>
                </div>
              </div>
              <div className="modalRows">
                <div className="modalLabel"> Cambio:</div>
                <div className="modalData">{`${
                  cancelado - totales.montoFacturarF < 0
                    ? "Ingrese un monto igual o superior"
                    : `${(cancelado - totales.montoFacturar).toFixed(2)} Bs.`
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
          <Button
            variant="danger"
            onClick={() => {
              setIsSaleModal(false);
              setTimeout(() => {
                setIsInvoice(false);
              }, 200);
            }}
          >
            {" "}
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
