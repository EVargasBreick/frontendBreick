import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { getBranches, getBranchesPs } from "../services/storeServices";
import loading2 from "../assets/loading2.gif";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { structureXml, getInvoiceNumber } from "../services/mockedServices";
import { dateString } from "../services/dateServices";
import Cookies from "js-cookie";
import "../styles/generalStyle.css";
import {
  createInvoice,
  deleteInvoice,
  otherPaymentsList,
} from "../services/invoiceServices";
import { SoapInvoice } from "../Xml/soapInvoice";
import xml2js from "xml2js";
import { SoapInvoiceTransaction } from "../Xml/soapInvoiceTransaction";
import { updateInvoicedOrder, updateStock } from "../services/orderServices";
import { createSale } from "../services/saleServices";
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
  const [userName, setUserName] = useState("");
  const [giftCard, setGiftCard] = useState(0);
  const [approvedId, setApprovedId] = useState("");
  const [aPagar, setAPagar] = useState(0);
  const [ofp, setOfp] = useState(0);
  const [otherPayments, setOtherPayments] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [userStore, setUserStore] = useState("");
  const [pdv, setPdv] = useState("");
  useEffect(() => {
    const otrosPagos = otherPaymentsList();
    otrosPagos
      .then((op) => {
        setOtherPayments(op.data);
      })
      .catch((err) => {});
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setUserName(JSON.parse(UsuarioAct).usuario);
      setUserStore(JSON.parse(UsuarioAct).idAlmacen);
      const pdve = Cookies.get("pdv");
      const PuntoDeVentas = pdv != undefined ? pdve : 0;
      setPdv(PuntoDeVentas);
    }
    const suc = getBranchesPs();
    suc.then((resp) => {
      const sucursales = resp.data;
      const sucur = sucursales.find((sc) => idAlmacen == sc.idAgencia);
      const branchData = {
        nombre: sucur.nombre,
        dir: sucur.direccion,
        tel: sucur.telefono,
        ciudad: sucur.ciudad,
        nro: sucur.idImpuestos,
      };
      console.log("Branch data", branchData);
      setBranchInfo(branchData);
    });
  }, []);
  useEffect(() => {
    if (cuf.length > 0) {
      setIsFactura(true);
    }
  }, [cuf]);
  useEffect(() => {
    if (isFactura) {
      invoiceRef.current.click();
    }
  }, [isFactura]);
  useEffect(() => {
    setCambio(parseFloat(cancelado - totales.montoFacturar).toFixed(2));
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
    switch (value) {
      case "1":
        setStringPago("Efectivo");
        setCardNumbersA("");
        setCardNumbersB("");
        setOfp(0);

        break;
      case "2":
        setStringPago("Tarjeta");
        setCancelado(totales.montoFacturar);
        setCambio(0);
        setOfp(0);
        break;
      case "3":
        setStringPago("Cheque");
        setCancelado(totales.montoFacturar);
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
        setCancelado(totales.montoFacturar);
        setCambio(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "6":
        setStringPago("Pago Posterior");
        setAPagar(1);
        setCancelado(totales.montoFacturar);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "7":
        setStringPago("Transferencia");
        setCancelado(totales.montoFacturar);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "8":
        setStringPago("Deposito");
        setCancelado(totales.montoFacturar);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "9":
        setStringPago("Transferencia Swift");
        setCancelado(totales.montoFacturar);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "10":
        setStringPago("Efectivo-tarjeta");
        setCancelado(totales.montoFacturar);
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
          if (cancelado == 0 || cancelado < totales.montoFacturar) {
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
              if (cancelado - (totales.montoFacturar - giftCard) < 0) {
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
    const invoiceBody = {
      idCliente: totales.idCliente,
      nroFactura: 1,
      idSucursal: branchInfo.nro,
      nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
      fechaHora: dateString(),
      nitCliente: cliente.nit,
      razonSocial: cliente.razonSocial,
      tipoPago: tipoPago,
      pagado: cancelado,
      cambio: cambio,
      nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
      cuf: `123456789ABCDEFGHIJKLMNIOPQRSTUVWXYZ`,
      importeBase: parseFloat(cancelado - cambio).toFixed(2),
      debitoFiscal: parseFloat((cancelado - cambio) * 0.13).toFixed(2),
      desembolsada: 0,
    };
    setFechaHora(dateString());
    setAlertSec("Generando informacion de ultima factura");
    setIsAlertSec(true);
    const lastIdObj = {
      nit: process.env.REACT_APP_NIT_EMPRESA,
      puntoDeVentaId: branchInfo.nro,
      tipoComprobante: 1,
    };
    const newId = getInvoiceNumber(lastIdObj);
    newId
      .then((res) => {
        const xmlRes = structureXml(
          selectedProducts,
          branchInfo,
          tipoPago,
          totales.montoFacturar,
          totales.descuentoCalculado,
          invoiceBody,
          res.response.data + 1,
          `${cardNumbersA}00000000${cardNumbersB}`,
          userName,
          1,
          0,
          0
        );
        xmlRes.then((resp) => {
          const lineal = resp.replace(/ {4}|[\t\n\r]/gm, "");
          const cufObj = {
            nit: process.env.REACT_APP_NIT_EMPRESA,
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
                  nit: process.env.REACT_APP_NIT_EMPRESA,
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
  function updateClient() {
    setCliente({
      nit: nit,
      razonSocial: razonSocial,
    });
    setIsModified(true);
  }
  function saveInvoice(
    cuf,
    cufd,
    autorizacion,
    fechaEmision,
    nro,
    idTransaccion,
    ofp,
    giftCard,
    aPagar
  ) {
    return new Promise((resolve, reject) => {
      setAlertSec("Guardando Venta");
      const invoiceBody = {
        idCliente: totales.idCliente,
        nroFactura: nro,
        idSucursal: branchInfo.nro,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
        fechaHora: dateString(),
        nitCliente: cliente.nit,
        razonSocial: cliente.razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: cambio,
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: cuf,
        importeBase: parseFloat(cancelado - cambio).toFixed(2),
        debitoFiscal: parseFloat((cancelado - cambio) * 0.13).toFixed(2),
        desembolsada: 0,
        autorizacion: autorizacion,
        cufd: cufd,
        fechaEmision: fechaEmision,
        nroTransaccion: idTransaccion,
        idOtroPago: ofp,
        vale: giftCard,
        aPagar: aPagar,
        puntoDeVenta: pdv,
        idAgencia: userStore,
      };
      setInvoice(invoiceBody);
      const newInvoice = createInvoice(invoiceBody);
      newInvoice
        .then((res) => {
          const newId = res.data.idCreado;
          const created = saveSale(newId);
          created
            .then((res) => {
              resolve(true);
            })
            .catch((error) => {
              reject(false);
            });
        })
        .catch((error) => {
          console.log("Error en la creacion de la factura", error);
        });

      //setIsSaleModal(!isSaleModal);
    });
  }
  function saveSale(createdId) {
    return new Promise((resolve, reject) => {
      setFechaHora(dateString());
      const objVenta = {
        pedido: {
          idUsuarioCrea: totales.idUsuarioCrea,
          idCliente: totales.idCliente,
          fechaCrea: dateString(),
          fechaActualizacion: dateString(),
          montoTotal: totales.montoTotal,
          descCalculado: totales.descuentoCalculado,
          descuento: totales.descuento,
          montoFacturar: totales.montoFacturar,
          idPedido: totales.idPedido,
          idFactura: createdId,
        },
        productos: selectedProducts,
      };
      const ventaCreada = createSale(objVenta);
      ventaCreada
        .then((res) => {
          const updatedStock = updateStock({
            accion: "take",
            idAlmacen: totales.idAlmacen,
            productos: selectedProducts,
          });
          updatedStock.then((us) => {
            const fecha = dateString();
            const updated = updateInvoicedOrder(totales.idPedido, fecha);
            updated.then((res) => {
              setAlertSec("Gracias por su compra!");
              resolve(true);
              setIsAlertSec(true);
              setTimeout(() => {
                setIsAlertSec(false);
              }, 1000);
            });
          });
        })
        .catch((err) => {
          console.log("Error al crear la venta", err);
          const deletedInvoice = deleteInvoice(createdId);
          reject(false);
        });
    });
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
                  <button ref={invoiceRef}>Print this out!</button>
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
          {tipoPago == 1 ? (
            <div>
              <div className="modalRows">
                <div className="modalLabel"> Monto cancelado:</div>
                <div className="modalData">
                  <Form>
                    <Form.Control
                      value={cancelado}
                      type="number"
                      onChange={(e) => setCancelado(e.target.value)}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={(e) => validateFormOfPayment(e)}>
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
