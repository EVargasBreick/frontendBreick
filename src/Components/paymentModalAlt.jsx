import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { getBranches, getBranchesPs } from "../services/storeServices";

import loading2 from "../assets/loading2.gif";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { structureXml, getInvoiceNumber } from "../services/mockedServices";
import { dateString } from "../services/dateServices";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";
import "../styles/generalStyle.css";
import {
  createInvoice,
  debouncedFullInvoiceProcess,
  deleteInvoice,
  invoiceUpdate,
  otherPaymentsList,
} from "../services/invoiceServices";
import { SoapInvoice } from "../Xml/soapInvoice";
import xml2js from "xml2js";
import { SoapInvoiceTransaction } from "../Xml/soapInvoiceTransaction";
import { updateInvoicedOrder, updateStock } from "../services/orderServices";
import { createSale, deleteSale } from "../services/saleServices";
import { InvoiceComponentAlt } from "./invoiceComponentAlt";
import { InvoiceComponentCopy } from "./invoiceComponentCopy";
import html2canvas from "html2canvas";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { formatInvoiceProducts } from "../Xml/invoiceFormat";
import { downloadAndPrintFile } from "../services/exportServices";
import { updateClientEmail } from "../services/clientServices";
export default function PaymentModalAlt({
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
  orderDetails,
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
  const [noFactura, setNoFactura] = useState("");
  const [invoice, setInvoice] = useState({});
  const [userStore, setUserStore] = useState("");
  const [pdv, setPdv] = useState("");
  const dropRef = useRef();
  const dropButtonRef = useRef();
  const invButtonRef = useRef();
  const invButtonRefAlt = useRef();
  const invoiceWrapRef = useRef(null);
  const componentCopyRef = useRef(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [clientEmail, setClientEmail] = useState(totales.correo);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const printRef = useRef(false);
  const uniqueId = uuidv4();
  const [isNewEmail, setIsNewEmail] = useState(false);
  const [altCuf, setaltCuf] = useState("");
  const [leyenda, setLeyenda] = useState("");
  const [urlSin, setUrlSin] = useState("");
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
      console.log("Punto de venta", pdve);
      const PuntoDeVentas = pdve != undefined ? pdve : 0;
      setPdv(PuntoDeVentas);
    }
    const suc = getBranchesPs();
    suc.then((resp) => {
      const sucursales = resp.data;

      const sucur = sucursales.find((sc) => idAlmacen == sc.idAgencia)
        ? sucursales.find((sc) => idAlmacen == sc.idAgencia)
        : sucursales.find((sc) => "AL001" == sc.idAgencia);

      const branchData = {
        nombre: sucur.nombre,
        dir: sucur.direccion,
        tel: sucur.telefono,
        ciudad: sucur.ciudad,
        nro: sucur.idImpuestos,
      };

      setBranchInfo(branchData);
    });
  }, []);
  useEffect(() => {
    if (cuf.length > 0 && noFactura != 0) {
      setIsFactura(true);
    }
  }, [cuf, noFactura]);
  useEffect(() => {
    if (isFactura && componentRef.current) {
      invoiceRef.current.click();
    }
    setTimeout(() => {
      console.log("Invoiceref2", invoiceRef);
    }, 2000);
  }, [isFactura, invoiceRef]);
  useEffect(() => {
    if (isDownloadable) {
      invButtonRefAlt.current.click();
    }
  }, [isDownloadable]);
  useEffect(() => {
    console.log("Invoice ref en su use", invoiceRef);
  }, [invoiceRef]);
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
        setAPagar(0);
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

  function handleEmail(value) {
    setClientEmail(value);
    setIsEmailValid(true);
  }

  function saveNewEmail(cuf) {
    if (clientEmail != totales.correo) {
      setIsNewEmail(true);
      setaltCuf(cuf);
    } else {
      setCuf(cuf);
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
          if (
            cancelado == 0 ||
            !parseFloat(cancelado).toFixed(2) >=
              parseFloat(totales.montoFacturar).toFixed(2)
          ) {
            setAlert("Ingrese un monto mayor o igual al monto de la compra");
            setIsAlert(true);
          } else {
            invoicingProcess();
          }
        } else {
          if (tipoPago == 2 || tipoPago == 10) {
            if (cardNumbersA.length < 4 || cardNumbersB.length < 4) {
              setAlert("Ingrese valores válidos para la tarjeta por favor");
              setIsAlert(true);
            } else {
              invoicingProcess();
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
                invoicingProcess();
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
            invoicingProcess();
          }
        }
      }
      resolve(true);
    });
  }

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (clientEmail === "") {
      return true;
    } else {
      if (!emailRegex.test(clientEmail)) {
        setIsEmailValid(false);
        return false;
      } else {
        setIsEmailValid(true);
        return true;
      }
    }
  }

  async function invoicingProcess() {
    const emailValidated = validateEmail();
    if (emailValidated) {
      setAlertSec("Obteniendo datos de factura");
      setIsAlertSec(true);
      const storeInfo = {
        nroSucursal: branchInfo.nro,
        puntoDeVenta: pdv,
      };
      const nroTarjeta = `${cardNumbersA}00000000${cardNumbersB}`;
      const productos = formatInvoiceProducts(selectedProducts);

      const saleBody = {
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
          idFactura: 0,
        },
        productos: selectedProducts,
      };
      const invoiceBody = {
        idCliente: totales.idCliente,
        nroFactura: 0,
        idSucursal: branchInfo.nro,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
        fechaHora: dateString(),
        nitCliente: cliente.nit,
        razonSocial: cliente.razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: cambio,
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: "",
        importeBase: parseFloat(cancelado - cambio).toFixed(2),
        debitoFiscal: parseFloat((cancelado - cambio) * 0.13).toFixed(2),
        desembolsada: 0,
        autorizacion: `${fechaHora}-${0}-${userStore}`,
        cufd: "",
        fechaEmision: "",
        nroTransaccion: 0,
        idOtroPago: ofp,
        vale: giftCard,
        aPagar: aPagar,
        puntoDeVenta: pdv,
        idAgencia: userStore,
        voucher: 0,
        pya: false,
      };

      const emizorBody = {
        numeroFactura: 0,
        nombreRazonSocial: cliente.razonSocial,
        codigoPuntoVenta: parseInt(pdv),
        fechaEmision: "",
        cafc: "",
        codigoExcepcion: 0,
        descuentoAdicional: totales.descuentoCalculado,
        montoGiftCard: 0,
        codigoTipoDocumentoIdentidad: totales.tipoDocumento,
        numeroDocumento: cliente.nit == 0 ? "1000001" : `${cliente.nit}`,
        complemento: "",
        codigoCliente: `${totales.idCliente}`,
        codigoMetodoPago: tipoPago,
        numeroTarjeta: nroTarjeta.length == 16 ? nroTarjeta : "",
        montoTotal: parseFloat(
          parseFloat(totales.montoFacturar - giftCard).toFixed(2)
        ),
        codigoMoneda: 1,
        tipoCambio: 1,
        montoTotalMoneda: parseFloat(
          parseFloat(totales.montoFacturar - giftCard).toFixed(2)
        ),
        usuario: userName,
        emailCliente: totales.correo,
        telefonoCliente: "",
        extras: { facturaTicket: uniqueId },
        codigoLeyenda: 0,
        montoTotalSujetoIva: parseFloat(
          parseFloat(parseFloat(totales.montoFacturar) - giftCard).toFixed(2)
        ),
        tipoCambio: 1,
        detalles: productos,
      };
      const updateStockBody = {
        idAlmacen: userStore,
        productos: [],
      };
      const composedBody = {
        venta: saleBody,
        invoice: invoiceBody,
        emizor: emizorBody,
        stock: updateStockBody,
        storeInfo: storeInfo,
      };
      console.log("BODY COMPUESTO", composedBody);
      try {
        setFechaHora(dateString());
        const invocieResponse = await debouncedFullInvoiceProcess(composedBody);
        console.log("Respuesta de la fac", invocieResponse);
        if (invocieResponse.data.code === 200) {
          const fecha = dateString();
          const parsed = JSON.parse(invocieResponse.data.data).data.data;
          console.log("Datos recibidos", parsed);
          if (parsed.emission_type_code === 1) {
            const updated = updateInvoicedOrder(totales.idPedido, fecha);
            updated.then((res) => {
              setAlertSec("Gracias por su compra!");
              setNoFactura(parsed.numeroFactura);
              saveNewEmail(parsed.cuf);
              setLeyenda(invocieResponse.data.leyenda);
              setIsAlertSec(true);
              setTimeout(() => {
                setIsAlertSec(false);
              }, 1000);
            });
          } else {
            const updated = updateInvoicedOrder(totales.idPedido, fecha);
            updated.then((res) => {
              setAlertSec("Gracias por su compra!");
              setNoFactura(parsed.numeroFactura);
              saveNewEmail(parsed.cuf);
              setIsAlertSec(true);
              console.log("Factura fuera de linea", parsed.shortLink);
              setNoFactura(parsed.numeroFactura);
              downloadAndPrintFile(
                parsed.shortLink,
                parsed.numeroFactura,
                cliente.nit
              );
              setAlertSec(
                "El servicio del SIN se encuentra no disponible, puede escanear el qr de esta nota para ir a su factura en las siguientes horas, muchas gracias"
              );
              setIsAlertSec(true);
              setTimeout(() => {
                window.location.reload();
              }, 5000);
              setTimeout(() => {
                setIsAlertSec(false);
              }, 1000);
            });
          }
        } else {
          if (invocieResponse.data.code === 500) {
            await debouncedFullInvoiceProcess.cancel();
            setIsAlertSec(false);
            setAlert(`${invocieResponse.data.message}`);
            setIsAlert(true);
            setTimeout(() => {
              setIsAlert(false);
            }, 4000);
          } else {
            await debouncedFullInvoiceProcess.cancel();
            const error = JSON.parse(
              JSON.parse(invocieResponse.data.error).data.data.errors
            );
            const errors = Object.values(error);
            console.log("Error al facturar", errors[0]);
            setIsAlertSec(false);
            setAlert(`${invocieResponse.data.message} : ${errors[0]}`);
            setIsAlert(true);
          }
        }
      } catch (error) {
        await debouncedFullInvoiceProcess.cancel();
        setIsAlertSec(false);
        setAlert("Error al facturar ", error);
        setIsAlert(true);
      }
    }
  }

  async function invoiceProcess(idFactura, idVenta, e) {
    e.preventDefault();
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
      caja: pdv,
    };
    const newId = getInvoiceNumber(lastIdObj);
    newId
      .then((res) => {
        setInvoiceId(res.response.data + 1);
        setAlertSec(`Última factura: ${res.response.data}`);
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
            caja: pdv,
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
                      var count = 0;
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
                        if (invocieResponse?.CUF[0].length > 10) {
                          setAlertSec("Generando Factura");
                          const resCuf = invocieResponse.CUF[0];
                          const resCufd = invocieResponse.CUFD[0];
                          const aut = invocieResponse.Autorizacion[0];
                          const fe = invocieResponse.FECHAEMISION[0];
                          const numFac = invocieResponse.NumeroFactura[0];
                          const idTrac = idTransaccion;
                          invoice.nroFactura = numFac;
                          if (count == 0) {
                            console.log("Invoice body", invoice);
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
                            const updateInvoice = invoiceUpdate(updateBody);
                            updateInvoice
                              .then((inv) => {
                                const fecha = dateString();
                                const updated = updateInvoicedOrder(
                                  totales.idPedido,
                                  fecha
                                );
                                updated.then((res) => {
                                  setAlertSec("Gracias por su compra!");
                                  setCuf(resCuf);
                                  setInvoiceNumber(numFac);
                                  setIsAlertSec(true);
                                  setTimeout(() => {
                                    setIsAlertSec(false);
                                  }, 1000);
                                });
                              })
                              .catch((err) => {
                                console.log(
                                  "Error al actualizar la factura",
                                  err
                                );
                              });
                          }
                          clearInterval(intervalId);
                        } else {
                          intento += 1;
                          setAlertSec("Generando Codigo Único de Facturación");
                        }
                      } else {
                        const errorInvoice =
                          resp.response.data.SalidaTransaccionBoliviaResponse[0]
                            .SalidaTransaccionBoliviaResult[0]
                            .TransaccionSalidaUnificada[0].Errores[0].Error[0]
                            .Descripcion[0];
                        setAlert(
                          `Error al obtener la factura, intente nuevamente, ${JSON.stringify(
                            errorInvoice
                          )}`
                        );
                        setIsAlert(true);
                        clearInterval(intervalId);
                        setIsAlertSec(false);
                        const deletedInvoice = deleteInvoice(idFactura);
                        deletedInvoice.then((rs) => {
                          const deletedSale = deleteSale(idVenta);
                          deletedSale.then((res) => {
                            console.log("Borrados");
                            console.log("Devolviendo Stock");
                            setIsAlertSec(false);
                          });
                        });
                      }
                    })
                    .catch((error) => {
                      console.log("Esto paso en la transaccion", error);
                    });
                }, 5000);
              });
            })
            .catch((err) =>
              console.log("Esto paso en la validacion del comprobante", err)
            );
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

  const debauncedSaving = debounce(saveInvoice, 30000, { leading: true });

  function handleSave(e) {
    console.log("Guardando 1");
    debauncedSaving(e);
  }

  function saveInvoice(e) {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      setAlertSec("Guardando Venta");
      const invoiceBody = {
        idCliente: totales.idCliente,
        nroFactura: 0,
        idSucursal: branchInfo.nro,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
        fechaHora: dateString(),
        nitCliente: cliente.nit,
        razonSocial: cliente.razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: cambio,
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: "",
        importeBase: parseFloat(cancelado - cambio).toFixed(2),
        debitoFiscal: parseFloat((cancelado - cambio) * 0.13).toFixed(2),
        desembolsada: 0,
        autorizacion: `${fechaHora}-${0}-${userStore}`,
        cufd: "",
        fechaEmision: "",
        nroTransaccion: 0,
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
          setTimeout(() => {
            const newId = res.data.idCreado;
            const created = saveSale(newId, e);
            created
              .then((res) => {
                resolve(true);
              })
              .catch((error) => {
                reject(false);
              });
          }, 500);
        })
        .catch((error) => {
          console.log("Error en la creacion de la factura", error);
          setAlert("Error al crear la factura, intente nuevamente");
        });

      //setIsSaleModal(!isSaleModal);
    });
  }
  function saveSale(createdId, e) {
    e.preventDefault(e);
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
          const idVenta = res.data.idCreado;
          setTimeout(() => {
            invoiceProcess(createdId, idVenta, e);
            resolve(true);
            setIsAlertSec(true);
          }, 500);
        })
        .catch((err) => {
          console.log("Error al crear la venta", err);
          const deletedInvoice = deleteInvoice(createdId);
          setAlert("Error al crear la factura, intente nuevamente");
          reject(false);
        });
    });
  }

  const handleDownloadPdfInv = async () => {
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
    const pdfWidth = 75;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    const pdfHeightCopy =
      (imgPropertiesCopy.height * pdfWidth) / imgPropertiesCopy.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(dataCopy, "PNG", 0, 0, pdfWidth, pdfHeightCopy);
    pdf.save(`factura-${noFactura}-${cliente.nit}.pdf`);
  };

  function saveEmail() {
    setIsNewEmail(false);
    const updatedEmail = updateClientEmail({
      idClient: totales.idCliente,
      mail: clientEmail,
    });
    updatedEmail
      .then((res) => {
        setAlertSec("Correo guardado correctamente");
        setIsAlertSec(true);
        setTimeout(() => {
          setCuf(altCuf);
          setIsAlertSec(false);
        }, 3000);
      })
      .catch((err) => {
        setAlert("Error al guardar el correo");
        setIsAlert(true);
      });
  }

  function cancelEmail() {
    setCuf(altCuf);
    setIsNewEmail(false);
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
      <Modal show={isNewEmail}>
        <Modal.Header closeButton>
          <Modal.Title>{`Desea guardar siguiente el correo ingresado? ${clientEmail}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ justifyContent: "space-evenly", display: "flex" }}>
            <Button
              variant="success"
              onClick={() => {
                saveEmail();
              }}
            >
              Si
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                cancelEmail();
              }}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={isSaleModal}>
        <Modal.Header>
          <Modal.Title>{`Facturacion`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactToPrint
            trigger={() => <button ref={invoiceRef}>Print this out!</button>}
            content={() => componentRef.current}
            onAfterPrint={() => {
              setIsDownloadable(true);
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }}
          />
          {isFactura ? (
            <div>
              <Button hidden>
                <InvoiceComponent
                  ref={componentRef}
                  branchInfo={branchInfo}
                  selectedProducts={selectedProducts}
                  cuf={cuf}
                  invoice={{
                    nitCliente: cliente.nit,
                    razonSocial: cliente.razonSocial,
                    nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
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
                  isOrder={true}
                  invoiceNumber={noFactura}
                  orderDetails={orderDetails}
                  leyenda={leyenda}
                  urlSin={urlSin}
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
              <div className="modalLabel"> Correo del cliente:</div>

              <Form.Control
                disabled={totales.correo !== ""}
                type="mail"
                value={clientEmail}
                isInvalid={!isEmailValid && totales.correo === ""}
                onChange={(e) => handleEmail(e.target.value)}
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

            <span style={{ color: "red", fontSize: "smaller" }}>
              {!isEmailValid && totales.correo === ""
                ? "Ingrese un correo válido o deje el espacio vacio"
                : ""}
            </span>
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
              totales.descuentoCalculado
            ).toFixed(2)}`}</div>
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
                  parseFloat(cancelado).toFixed(2) -
                    parseFloat(totales.montoFacturar).toFixed(2) <
                  0
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
              invoice={{
                nitCliente: cliente.nit,
                razonSocial: cliente.razonSocial,
                nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
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
              isOrder={true}
              invoiceNumber={noFactura}
              orderDetails={orderDetails}
              leyenda={leyenda}
              urlSin={urlSin}
            />
            <InvoiceComponentCopy
              ref={componentCopyRef}
              branchInfo={branchInfo}
              selectedProducts={selectedProducts}
              cuf={cuf}
              invoice={{
                nitCliente: cliente.nit,
                razonSocial: cliente.razonSocial,
                nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
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
              isOrder={true}
              invoiceNumber={noFactura}
              orderDetails={orderDetails}
              leyenda={leyenda}
              urlSin={urlSin}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
