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
import {
  deleteInvoice,
  invoiceUpdate,
  logIncompleteInvoice,
} from "../services/invoiceServices";
import { deleteSale } from "../services/saleServices";
import Cookies from "js-cookie";
import { debounce } from "lodash";
function SaleModal(
  {
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
    setTotalFacturar,
    setTotalDesc,
    setTotalPrevio,
    giftCard,
    setGiftCard,
    ofp,
    setOfp,
    aPagar,
    setAPagar,
    isRoute,
  },
  ref
) {
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
  const [motivo, setMotivo] = useState("");
  const [isDrop, setIsDrop] = useState(false);
  const [dropId, setDropId] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [invoiceHeight, setInvoiceHeight] = useState("");
  const dropRef = useRef();
  const dropButtonRef = useRef();
  const invButtonRef = useRef();
  const invButtonRefAlt = useRef();
  const invoiceWrapRef = useRef(null);
  const componentCopyRef = useRef(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const totalDesc = datos.total * (1 - datos.descuento / 100);
  const [descuentoFactura, setDescuentoFactura] = useState(totalDesc);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [transactionObject, setTransactionObject] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isEmailModal, setIsEmailModal] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [invoiceNubmer, setInvoiceNumber] = useState("");
  const [invObj, setInvObj] = useState({});
  const [idFactura, setIdFactura] = useState("");
  const [noFactura, setNoFactura] = useState("");
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  const isMobile = isMobileDevice();
  useEffect(() => {
    console.log("Is mobile", isMobile);
    console.log("CUF guardado");
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
    console.log(
      "Cambio",
      cancelado - (total * (1 - datos.descuento / 100) - giftCard)
    );
    setCambio(
      isRoute
        ? cancelado - totalDescontado
        : Math.abs(
            (
              cancelado -
              (total * (1 - datos.descuento / 100) - giftCard)
            ).toFixed()
          )
    );
  }, [cancelado]);

  useEffect(() => {
    if (isSaved) {
      window.location.reload();
    }
  }, [isSaved]);

  useEffect(() => {
    if (isDownloadable) {
      invButtonRefAlt.current.click();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isDownloadable]);

  useEffect(() => {
    setTotalFacturar(datos.total - giftCard);
    setTotalDesc(descuentoCalculado);
    setCancelado(
      parseFloat(parseFloat(-giftCard) + parseFloat(datos.total)).toFixed(2)
    );
    setCambio(0);
    setDescuentoFactura(total - totalDesc + parseFloat(giftCard));
    console.log("Totaldesc", total - totalDesc + parseFloat(giftCard));
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
        setGiftCard(0);
        break;
      case "2":
        setStringPago("Tarjeta");
        setCancelado(totalDescontado);
        setCambio(0);
        setOfp(0);
        setGiftCard(0);
        break;
      case "3":
        setStringPago("Cheque");
        setCancelado(totalDescontado);
        setCambio(0);
        setOfp(0);
        setGiftCard(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "4":
        setStringPago("Efectivo");
        setCancelado(0);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "5":
        setStringPago("Otros");
        setCancelado(totalDescontado);
        setCambio(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "6":
        setStringPago("Pago Posterior");
        setAPagar(0);
        setCancelado(totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "7":
        setStringPago("Transferencia");
        setCancelado(totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "8":
        setStringPago("Deposito");
        setCancelado(totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "9":
        setStringPago("Transferencia Swift");
        setCancelado(totalDescontado);
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "10":
        setStringPago("Efectivo-tarjeta");
        setCancelado(parseFloat(totalDescontado).toFixed(2));
        setOfp(0);
        setCambio(0);
        setGiftCard(0);
        break;
      case "11":
        setStringPago("Baja");
        setDescuento(0);
        setCancelado(0);
        setOfp(0);
        setCambio(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
    }
  }
  function validateFormOfPayment(e) {
    e.preventDefault();
    console.log("Tipo de pago", tipoPago);
    return new Promise((resolve) => {
      if (tipoPago == 0) {
        setAlert("Seleccione un metodo de pago");
        setIsAlert(true);
      } else {
        if (tipoPago == 1) {
          console.log("Cancelado", cancelado, totalDescontado);
          if (cancelado == 0 || cancelado - (totalDescontado + giftCard) < 0) {
            setAlert("Ingrese un monto mayor o igual al monto de la compra");
            setIsAlert(true);
          } else {
            handleSave(e);
          }
        } else {
          if (tipoPago == 2 || tipoPago == 10) {
            if (cardNumbersA.length < 4 || cardNumbersB.length < 4) {
              setAlert("Ingrese valores válidos para la tarjeta por favor");
              setIsAlert(true);
            } else {
              handleSave(e);
            }
          }
          if (tipoPago == 4) {
            if (giftCard == 0) {
              setAlert("Ingrese un valor válido para el vale");
              setIsAlert(true);
            } else {
              if (cancelado <= totalDescontado - giftCard) {
                setAlert("Ingrese un valor mayor al saldo");
                setIsAlert(true);
              } else {
                handleSave(e);
              }
            }
          }
          if (
            tipoPago == 3 ||
            tipoPago == 6 ||
            tipoPago == 7 ||
            tipoPago == 8 ||
            tipoPago == 9
          ) {
            handleSave(e);
          }
          if (tipoPago == 5) {
            console.log("Ofp", ofp);
            if (ofp === 0) {
              setAlert("Especifique el otro tipo de pago");
              setIsAlert(true);
            } else {
              handleSave(e);
            }
          }
          if (tipoPago == 11) {
            setAlertSec("Guardando baja");
            setIsAlertSec(true);

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
                const objStock = {
                  accion: "take",
                  idAlmacen: userStore,
                  productos: selectedProducts,
                  detalle: `SPRBJ-${res.data.id}`,
                };
                const updatedStock = updateStock(objStock);
                updatedStock
                  .then((res) => {
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
  const childFunction = (idFactura, idVenta, objStock) => {
    invoiceProcess(idFactura, idVenta, objStock);
  };
  React.useImperativeHandle(ref, () => ({
    childFunction,
  }));
  const debauncedSaving = debounce(savingInvoice, 30000, { leading: true });

  function handleSave(e) {
    setIsSaleModal(false);
    console.log("Guardando 1");
    debauncedSaving(e);
  }

  function savingInvoice(e) {
    console.log("Dentro del debounce");
    e.preventDefault(e);
    const saved = saveInvoice(
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      ofp,
      giftCard,
      aPagar
    );
    saved.then((res) => {
      setIsAlertSec(true);
    });
  }
  async function invoiceProcess(idFactura, idVenta, objStock) {
    let showError = 0;
    setIdFactura(idFactura);
    setAlertSec("Generando información de última factura");
    setIsAlertSec(true);
    const lastIdObj = {
      nit: invoice.nitEmpresa,
      puntoDeVentaId: branchInfo.nro,
      tipoComprobante: 1,
      caja: pointOfSale,
    };
    console.log("Last id obj", lastIdObj);
    const newId = getInvoiceNumber(lastIdObj);
    newId
      .then((res) => {
        setInvoiceId(res.response.data + 1);
        const nextId = res.response.data + 1;
        setAlertSec(`Última factura: ${res.response.data}`);
        setTimeout(() => {
          setAlertSec("Generando Codigo Único de Facturación");
        }, 1500);
        const xmlRes = structureXml(
          selectedProducts,
          branchInfo,
          tipoPago == 4 ? 1 : tipoPago,
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
          showError += 1;
          console.log(
            "🚀 ~ file: saleModal.js:492 ~ xmlRes.then ~ showError:",
            showError
          );
          comprobante
            .then((res) => {
              console.log(
                "Resultado de la validacion del comprobante",
                res.response.data
              );
              showError += 1;

              console.log(
                "🚀 ~ file: saleModal.js:515 ~ intervalId ~ showError:",
                showError
              );
              xml2js.parseString(res.response.data, (err, result) => {
                setApprovedId(result.SalidaTransaccion.Transaccion[0].ID[0]);
                setTransactionId(result.SalidaTransaccion.Transaccion[0].ID[0]);
                const transacObj = {
                  nit: invoice.nitEmpresa,
                  id: result.SalidaTransaccion.Transaccion[0].ID[0],
                };

                setTransactionObject(transacObj);
                const idTransaccion =
                  result.SalidaTransaccion.Transaccion[0].ID[0];
                var intento = 1;
                var maxIntentos = 10;
                var count = 0;
                const updateBodyInit = {
                  nroFactura: nextId,
                  cuf: "",
                  cufd: "",
                  autorizacion: `${dateString()}|${pointOfSale}|${userStore}`,
                  fe: "",
                  nroTransaccion: idTransaccion,
                  idFactura: idFactura,
                };
                const updatedMedium = updateInvoiceProcess(updateBodyInit);
                console.log("Updateado", updatedMedium);
                let intervalId = setInterval(function () {
                  const transaccion = SoapInvoiceTransaction(transacObj);
                  transaccion
                    .then((resp) => {
                      console.log(
                        "Respuesta de la transaccion",
                        resp.response.data.SalidaTransaccionBoliviaResponse[0]
                          .SalidaTransaccionBoliviaResult[0]
                      );
                      const invoiceState =
                        resp.response.data.SalidaTransaccionBoliviaResponse[0]
                          .SalidaTransaccionBoliviaResult[0].Transaccion[0]
                          .Estado[0];
                      const invocieResponse =
                        resp.response.data.SalidaTransaccionBoliviaResponse[0]
                          .SalidaTransaccionBoliviaResult[0]
                          .TransaccionSalidaUnificada[0];
                      if (invoiceState == "Transacción Exitosa") {
                        console.log("Count", count);
                        const numFac = invocieResponse.NumeroFactura[0];
                        setNoFactura(numFac);
                        const idTrac = idTransaccion;
                        const updateBodyInit = {
                          nroFactura: numFac,
                          cuf: "",
                          cufd: "",
                          autorizacion: `${dateString()}|${pointOfSale}|${userStore}`,
                          fe: "",
                          nroTransaccion: idTrac,
                          idFactura: idFactura,
                        };
                        const updated = updateInvoiceProcess(updateBodyInit);
                        updated.then((res) => {
                          if (invocieResponse?.CUF[0].length > 10) {
                            setAlertSec("Generando Factura");
                            const resCuf = invocieResponse.CUF[0];
                            const resCufd = invocieResponse.CUFD[0];
                            const aut = invocieResponse.Autorizacion[0];
                            const fe = invocieResponse.FECHAEMISION[0];
                            invoice.nroFactura = numFac;
                            invoice.cuf = resCuf;

                            console.log("Venta registrada");
                            const updateBody = {
                              nroFactura: numFac,
                              cuf: resCuf,
                              cufd: resCufd,
                              autorizacion: aut,
                              fe: fe,
                              nroTransaccion: idTrac,
                              idFactura: idFactura,
                            };
                            const updated = updateInvoiceProcess(updateBody);
                            updated.then((res) => {
                              console.log("Factura actualizada");
                              clearInterval(intervalId);
                              setCuf(resCuf);
                            });
                          } else {
                            if (intento == maxIntentos) {
                              setIsAlertSec(false);
                              setIsAlert(false);
                              setAlert(
                                "Error al obtener el codigo unico de facturación, intente nuevamente"
                              );
                              const obj = {
                                nroFactura: numFac,
                                idSucursal: 0,
                                puntoDeVenta: 0,
                                nroTransaccion: idTransaccion,
                                idgencia: userStore,
                              };
                              setInvObj(obj);

                              clearInterval(intervalId);
                              setIsEmailModal(true);
                            } else {
                              intento += 1;
                            }
                          }
                        });
                      } else {
                        if (showError < 2) {
                          const reverted = rollbackPurchase(
                            idFactura,
                            idVenta,
                            objStock
                          );
                          reverted.then((res) => {
                            const errorInvoice =
                              resp.response.data
                                .SalidaTransaccionBoliviaResponse[0]
                                .SalidaTransaccionBoliviaResult[0]
                                .TransaccionSalidaUnificada[0].Errores[0]
                                .Error[0].Descripcion[0];
                            setIsAlertSec(false);
                            setTransactionObject("");
                            setAlert(
                              `Error al obtener la factura, intente nuevamente, ${JSON.stringify(
                                errorInvoice
                              )}`
                            );
                            setIsAlert(true);
                            clearInterval(intervalId);
                          });
                        }
                      }
                    })
                    .catch((error) => {
                      const updateBodyInit = {
                        nroFactura: nextId,
                        cuf: "",
                        cufd: "",
                        autorizacion: `${dateString()}|${pointOfSale}|${userStore}`,
                        fe: "",
                        nroTransaccion: idTransaccion,
                        idFactura: idFactura,
                      };
                      const updated = updateInvoiceProcess(updateBodyInit);
                      updated.then((res) => {
                        setIsAlertSec(false);
                        setIsAlert(false);
                        setAlert(
                          "Error al obtener el codigo unico de facturación, intente nuevamente"
                        );
                        const obj = {
                          nroFactura: nextId,
                          idSucursal: 0,
                          puntoDeVenta: 0,
                          nroTransaccion: idTransaccion,
                          idgencia: userStore,
                        };
                        setInvObj(obj);
                        clearInterval(intervalId);
                        setIsEmailModal(true);
                      });
                    });
                }, 10000);
              });
            })
            .catch((err) => {
              if (showError < 2) {
                const reverted = rollbackPurchase(idFactura, idVenta, objStock);
                reverted.then((res) => {
                  setIsAlertSec(false);
                  setTransactionObject("");
                  setAlert("Error procesar el comprobante, intente nuevamente");
                  setIsAlert(true);
                });
              }
            });
        });
      })
      .catch((err) => {
        if (showError < 2) {
          const reverted = rollbackPurchase(idFactura, idVenta, objStock);
          reverted.then((res) => {
            setIsAlertSec(false);
            setAlert(
              "Error al obtener el ultimo numero de comprobante, intente nuevamente"
            );
            setIsAlert(true);
            console.log("Error al obtener el id", err);
          });
        }
      });
  }

  function logInnvoice() {
    setAlertSec("Registrando factura para impresion posterior");
    setIsAlertSec(true);
    const UsuarioAct = Cookies.get("userAuth");
    const idAlmacen = JSON.parse(UsuarioAct);
    const PuntoDeVenta = Cookies.get("pdv");
    console.log("Usuario", idAlmacen);
    const object = {
      idFactura: idFactura,
      nroFactura: invoiceId,
      idSucursal: branchInfo.nro,
      puntoDeVenta: PuntoDeVenta,
      nroTransaccion: transactionId,
      idAlmacen: idAlmacen.idAlmacen,
      correoCliente: clientEmail,
    };
    const logged = logIncompleteInvoice(object);
    logged
      .then((res) => {
        console.log("Factura loggeada", res);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      })
      .catch((err) => {
        console.log("Error al loggear la factura");
      });
  }

  async function updateInvoiceProcess(updateBody) {
    const updateInvoice = invoiceUpdate(updateBody);
    return updateInvoice
      .then((inv) => {
        return new Promise((resolve) => resolve(true));
      })
      .catch((err) => {
        console.log("Error al actualizar la factura", err);
      });
  }

  function rollbackPurchase(idFactura, idVenta, objStock) {
    return new Promise((resolve) => {
      const deletedInvoice = deleteInvoice(idFactura);
      deletedInvoice.then((rs) => {
        const deletedSale = deleteSale(idVenta);
        deletedSale.then((res) => {
          console.log("Borrados");
          console.log("Devolviendo Stock");
          setIsAlertSec(false);
          const returned = updateStock(objStock);
          setIsAlertSec(false);
          returned
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              console.log("Error al devolver el stock", err);
            });
        });
      });
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
      format: [80, mmHeight * 1.5 + 20],
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
    pdf.save(`factura-${invoiceId}-${invoice.nitCliente}.pdf`);
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

      <Modal show={isEmailModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {
              "Ingrese el correo del cliente, la factura se enviará en las siguientes 24 hrs"
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              value={clientEmail}
              type="text"
              placeholder="Ingrese correo"
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              logInnvoice();
            }}
          >
            Registrar Correo y recargar
          </Button>
        </Modal.Footer>
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
                  onAfterPrint={() => {
                    setIsDownloadable(true);
                  }}
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
                      cambio:
                        parseFloat(cancelado) -
                        parseFloat(totalDescontado) +
                        parseFloat(giftCard),
                      fechaHora: fechaHora,
                    }}
                    totalsData={{
                      total: total,
                      descuentoCalculado: isRoute
                        ? descuentoCalculado
                        : descuentoFactura,
                      totalDescontado: totalDescontado - giftCard,
                    }}
                    giftCard={giftCard}
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
                    cambio:
                      parseFloat(cancelado) -
                      parseFloat(totalDescontado) +
                      parseFloat(giftCard),
                    fechaHora: fechaHora,
                  }}
                  totalsData={{
                    total: total,
                    descuentoCalculado: isRoute
                      ? descuentoCalculado
                      : descuentoFactura,
                    totalDescontado: totalDescontado - giftCard,
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
                    cambio:
                      parseFloat(cancelado) -
                      parseFloat(totalDescontado) +
                      parseFloat(giftCard),
                    fechaHora: fechaHora,
                  }}
                  totalsData={{
                    total: total,
                    descuentoCalculado: isRoute
                      ? descuentoCalculado
                      : descuentoFactura,
                    totalDescontado: totalDescontado - giftCard,
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
              {(
                parseFloat(giftCard != "" ? giftCard : 0) +
                parseFloat(descuentoCalculado)
              ).toFixed(2)}
            </div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> Total a pagar:</div>
            <div className="modalData">{`${parseFloat(totalDescontado).toFixed(
              2
            )} Bs.`}</div>
          </div>
          <div className="modalRows">
            <div className="modalLabel"> pago:</div>
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
                  {!isRoute ? <option value="4">Vales</option> : null}
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
                  cancelado - totalDescontado < 0
                    ? " Ingrese un monto igual o superior"
                    : `${(cancelado - totalDescontado).toFixed(2)} Bs.`
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
                  -cancelado + parseFloat(totalDescontado)
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
                  datos.total - giftCard < 0
                    ? "El valor del Vale es mayor al monto de la compra"
                    : `${parseFloat(
                        parseFloat(-giftCard) +
                          total * (1 - datos.descuento / 100)
                      ).toFixed(2)} Bs.`
                } `}</div>
              </div>
              {1 > 0 ? (
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
                      cancelado -
                        (total * (1 - datos.descuento / 100) - giftCard) <
                      0
                        ? "Ingrese un monto mayor"
                        : `${(
                            cancelado -
                            totalDesc +
                            parseFloat(giftCard)
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
                      <option value="muestra">Venta en línea</option>
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
              ref={componentRef}
              branchInfo={branchInfo}
              selectedProducts={selectedProducts}
              cuf={cuf}
              invoice={invoice}
              paymentData={{
                tipoPago: stringPago,
                cancelado: cancelado,

                cambio:
                  parseFloat(cancelado) -
                  parseFloat(totalDescontado) +
                  parseFloat(giftCard),
                fechaHora: fechaHora,
              }}
              totalsData={{
                total: total,
                descuentoCalculado: isRoute
                  ? descuentoCalculado
                  : descuentoFactura,
                totalDescontado: totalDescontado - giftCard,
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
                cambio:
                  parseFloat(cancelado) -
                  parseFloat(totalDescontado) +
                  parseFloat(giftCard),
                fechaHora: fechaHora,
              }}
              totalsData={{
                total: total,
                descuentoCalculado: isRoute
                  ? descuentoCalculado
                  : descuentoFactura,
                totalDescontado: totalDescontado - giftCard,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default React.forwardRef(SaleModal);
