import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import InvoicePDF from "./invoicePDF";
import QrComponent from "./qrComponent";
export default function SaleModal({ datos, show }) {
  const [isSaleModal, setIsSaleModal] = useState(true);
  const [tipoPago, setTipoPago] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [cancelado, setCancelado] = useState("");
  const [cardNumbersA, setCardNumbersA] = useState("");
  const [cardNumbersB, setCardNumbersB] = useState("");
  const numberARef = useRef();
  const numberBRef = useRef();
  useEffect(() => {
    setIsSaleModal(show);
  }, []);
  const handleClose = () => {
    setIsSaleModal(!isSaleModal);
  };
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
    setCancelado();
    setCardNumbersA("");
    setCardNumbersB("");
  }
  return (
    <div>
      <QrComponent className="hiddenQr" />
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
            <div className="modalData">{`${datos.total} Bs.`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Descuento:</div>
            <div className="modalData">{`${datos.descuento} %`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Total a pagar:</div>
            <div className="modalData">{`${datos.totalDescontado} Bs.`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Tipo de pago:</div>
            <div className="modalData">
              <Form>
                <Form.Select onChange={(e) => handleTipoPago(e.target.value)}>
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
                  {
                    <Form>
                      <Form.Control
                        type="text"
                        onChange={(e) => setCancelado(e.target.value)}
                        value={cancelado}
                      ></Form.Control>
                    </Form>
                  }
                </div>
              </div>
              <div className="modalRows">
                <div className="modalLabel"> Cambio:</div>
                <div className="modalData">{`${
                  cancelado - datos.totalDescontado < 0
                    ? ""
                    : (cancelado - datos.totalDescontado).toFixed(2)
                } Bs.`}</div>
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
          <Button variant="danger" onClick={handleClose}>
            Imprimir Factura
          </Button>
          <PDFDownloadLink
            fileName={`fileName`}
            document={<InvoicePDF />}
          ></PDFDownloadLink>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
