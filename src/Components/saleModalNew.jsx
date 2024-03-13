import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image, FormControl } from "react-bootstrap";
import loading2 from "../assets/loading2.gif";
import ReactToPrint from "react-to-print";
import { InvoiceComponent } from "./invoiceComponent";
import { dateString, formatDate } from "../services/dateServices";
import {
  composedDrop,
  debouncedComposedDrop,
  registerDrop,
} from "../services/dropServices";
import { updateStock } from "../services/orderServices";
import { DropComponent } from "./dropComponent";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { InvoiceComponentAlt } from "./invoiceComponentAlt";
import { InvoiceComponentCopy } from "./invoiceComponentCopy";
import {
  debouncedFullInvoiceProcess,
  onlineInvoiceProcess,
} from "../services/invoiceServices";
import { formatInvoiceProducts } from "../Xml/invoiceFormat";
import { updateClientEmail } from "../services/clientServices";
import { v4 as uuidv4 } from "uuid";
import { emizorService } from "../services/emizorService";
import { TipoPagoComponent } from "./tipoPagoCOmponent";
import {
  roundToTwoDecimalPlaces,
  rountWithMathFloor,
} from "../services/mathServices";
import ToastComponent from "./Modals/Toast";
import Cookies from "js-cookie";

function SaleModalNew(
  {
    aPagar,
    branchInfo,
    clientId,
    datos,
    emailCliente,
    isRoute,
    isSaleModal,
    ofp,
    otherPayments,
    pointOfSale,
    saleType,
    selectedProducts,
    setAPagar,
    setAlert,
    setIsAlert,
    setIsInvoice,
    setIsSaleModal,
    setOfp,
    tipoDocumento,
    updateStockBody,
    userData,
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
  const componentRef = useRef();
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
  const [descuentoFactura, setDescuentoFactura] = useState(
    datos.descuentoCalculado
  );
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [offlineText, setOfflineText] = useState("");
  const [clientEmail, setClientEmail] = useState(emailCliente);
  const [noFactura, setNoFactura] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [auxClientEmail] = useState(emailCliente);
  const [isNewEmail, setIsNewEmail] = useState(false);
  const [altCuf, setaltCuf] = useState("");
  const [leyenda, setLeyenda] = useState("");
  const [urlSin, setUrlSin] = useState("");
  const [giftCard, setGiftCard] = useState(0);
  const [valeForm, setValeForm] = useState({});
  const [voucher, setVoucher] = useState(0);
  const [isPya, setIsPya] = useState(false);
  const [tipoPago, setTipoPago] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [cancelado, setCancelado] = useState(0);
  const [cardNumbersA, setCardNumbersA] = useState("");
  const [cardNumbersB, setCardNumbersB] = useState("");
  const canc = valeForm.cancelado ? valeForm.cancelado : cancelado;
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [onlineDate, setOnlineDate] = useState({ fechaHora: "", emision: "" });
  const [motivoDetalle, setMotivoDetalle] = useState("");
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  const uniqueId = uuidv4();
  const isMobile = isMobileDevice();
  //console.log("Data del branch", branchInfo);
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

  const [ping, setPing] = useState(false);
  const [pingError, setPingError] = useState("");

  const pingURL = async () => {
    try {
      const response =
        process.env.REACT_APP_ENDPOINT_URL == "http://localhost"
          ? await fetch("https://sinfel.emizor.com/login")
          : await fetch("https://fel.emizor.com/login");
      if (response.ok) {
        console.log("Ping successful.");
      } else {
        console.error("Ping Failed.");
        setPingError(
          "Problemas al contactar a Emizor, contacte al departamento de Sistemas."
        );
        setPing(true);
      }
    } catch (error) {
      console.error("Error pinging URL:", error);
      console.error("Ping Failed in pinging.");
    }
  };

  useEffect(() => {
    pingURL();
  }, []);

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
    const cambios = rountWithMathFloor(
      cancelado - datos.totalDescontado - giftCard
    );
    setCambio(
      isRoute ? cancelado - rountWithMathFloor(datos.totalDescontado) : cambios
    );
  }, [cancelado]);

  useEffect(() => {
    if (isSaved) {
      Cookies.remove("nit");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, [isSaved]);

  useEffect(() => {
    if (isDownloadable) {
      invButtonRefAlt.current.click();
      Cookies.remove("nit");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, [isDownloadable]);

  useEffect(() => {
    console.log("ACA SE ESTA SETTEANDO");

    setCancelado(
      rountWithMathFloor(
        Number(Number(-giftCard) + Number(datos.totalDescontado))
      )
    );
    setCambio(0);
    setDescuentoFactura(
      datos.total - datos.descuentoCalculado + Number(giftCard)
    );
    console.log(
      "datos.descuentoCalculado",
      datos.total - datos.descuentoCalculado + Number(giftCard)
    );
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
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setOfp(0);
        break;
      case "3":
        setStringPago("Cheque");
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setOfp(0);
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
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "6":
        setStringPago("Pago Posterior");
        setAPagar(0);
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        break;
      case "7":
        setStringPago("Transferencia");
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "8":
        setStringPago("Deposito");
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "9":
        setStringPago("Transferencia Swift");
        setCancelado(roundToTwoDecimalPlaces(datos.totalDescontado));
        setCambio(0);
        setOfp(0);
        setCardNumbersA("");
        setCardNumbersB("");
        setGiftCard(0);
        break;
      case "10":
        setStringPago("Efectivo-tarjeta");
        setCancelado(
          Number(roundToTwoDecimalPlaces(datos.totalDescontado)).toFixed(2)
        );
        setOfp(0);
        setCambio(0);
        setGiftCard(0);
        break;
      case "11":
        setStringPago("Baja");
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
    if (tipoPago == 4 && valeForm) {
      handleTipoPago(valeForm.tipoPago.toString());
      console.log("Vale Form when is selected tipo 4", valeForm);
      setTipoPago(valeForm.tipoPago.toString());
      setCancelado(valeForm.cancelado);
      setCardNumbersA(valeForm.cardNumbersA);
      setCardNumbersB(valeForm.cardNumbersB);
      setOfp(valeForm.ofp);
      setGiftCard(valeForm.vale);
    }
    return new Promise(async (resolve) => {
      if (tipoPago == 0) {
        setAlert("Seleccione un metodo de pago");
        setIsAlert(true);
      } else {
        if (tipoPago == 1) {
          console.log(
            "Cancelado",
            cancelado,
            roundToTwoDecimalPlaces(datos.totalDescontado),
            giftCard,
            voucher
          );
          if (
            cancelado == 0 ||
            Number(cancelado) +
              Number(voucher) -
              (roundToTwoDecimalPlaces(datos.totalDescontado) + giftCard) <
              0
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
          if (
            tipoPago == 4 &&
            roundToTwoDecimalPlaces(datos.totalDescontado) > giftCard
          ) {
            console.log(
              "Solo deberia correr esto en caso de vale menor al total"
            );
            console.log("Cancelado", cancelado);
            console.log(
              "Total desc",
              roundToTwoDecimalPlaces(datos.totalDescontado)
            );
            console.log("giftc", giftCard);
            console.log("Valeform", valeForm);
            if (giftCard == 0) {
              setAlert("Ingrese un valor válido para el vale");
              setIsAlert(true);
            } else {
              if (
                canc <
                roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard
              ) {
                setAlert("Ingrese un valor mayor al saldo");
                setIsAlert(true);
              } else {
                invoicingProcess();
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
            invoicingProcess();
          }
          if (tipoPago == 5) {
            console.log("Ofp", ofp);
            if (ofp === 0) {
              setAlert("Especifique el otro tipo de pago");
              setIsAlert(true);
            } else {
              invoicingProcess();
            }
          }
          if (
            tipoPago == 11 ||
            (tipoPago == 4 &&
              roundToTwoDecimalPlaces(datos.totalDescontado) <= giftCard)
          ) {
            console.log("Entro aca");
            console.log("Valeform", valeForm);
            if (valeForm || tipoPago == 11) {
              setAlertSec("Guardando baja");
              setIsAlertSec(true);
              const objBaja = {
                motivo:
                  tipoPago == 4 &&
                  roundToTwoDecimalPlaces(datos.totalDescontado) <= giftCard
                    ? "vale"
                    : `${motivo} : ${motivoDetalle}`,
                fechaBaja: dateString(),
                idUsuario: userData.userId,
                idAlmacen: userData.userStore,
                productos: selectedProducts,
                totalbaja: roundToTwoDecimalPlaces(datos.totalDescontado),
                vale: giftCard,
                ci: datos.nit,
              };
              const objStock = {
                accion: "take",
                idAlmacen: userData.userStore,
                productos: selectedProducts,
              };
              const compObj = {
                baja: objBaja,
                stock: objStock,
              };
              try {
                const createdDrop = await debouncedComposedDrop(compObj);
                console.log("Baja creada", createdDrop);
                if (motivo == "online") {
                  await registerOnlineSale();
                }
                setDropId(createdDrop.data.idCreado);
                setIsDrop(true);
              } catch (error) {
                const errMessage = error.response.data.data.includes(
                  "stock_nonnegative"
                )
                  ? "El stock requerido de algun producto seleccionado ya no se encuentra disponible"
                  : "";
                console.log("Error al crear la baja", errMessage);
                setIsAlertSec(false);
                setAlert(`Error al crear la baja:  ${errMessage}`);
                setIsAlert(true);
                debouncedComposedDrop.cancel();
              }
            }
          }
        }
      }
      resolve(true);
    });
  }

  function handleEmail(value) {
    setClientEmail(value);
    setIsEmailValid(true);
  }

  function validateEmail() {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
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

  function saveNewEmail(cuf) {
    if (clientEmail != auxClientEmail) {
      setIsNewEmail(true);
      setaltCuf(cuf);
    } else {
      setCuf(cuf);
    }
  }

  async function invoicingProcess() {
    console.log("Unique id", uniqueId);
    const emailValidated = validateEmail();
    if (emailValidated) {
      setAlertSec("Obteniendo datos de factura");
      setIsAlertSec(true);
      const storeInfo = {
        nroSucursal: branchInfo.nro,
        puntoDeVenta: pointOfSale,
      };
      const descAdicional = Number(datos.descuentoCalculado) + Number(giftCard);
      const nroTarjeta = `${cardNumbersA}00000000${cardNumbersB}`;
      const productos = formatInvoiceProducts(selectedProducts);
      console.log("Descuento calculado", descAdicional);

      const saleBodyNew = {
        pedido: {
          idUsuarioCrea: userData.userId,
          idCliente: clientId,
          fechaCrea: dateString(),
          fechaActualizacion: dateString(),
          montoTotal: datos.total,
          descuento: datos.descuento,
          descCalculado: Number(datos.descuentoCalculado) + Number(giftCard),
          montoFacturar: Number(datos.totalDescontado) - giftCard,
          idPedido: "",
          idFactura: 0,
        },
        productos: selectedProducts,
      };

      const invoiceBodyNew = {
        idCliente: clientId,
        nroFactura: 0,
        idSucursal: branchInfo.nro,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
        fechaHora: dateString(),
        nitCliente: datos.nit,
        razonSocial: datos.razonSocial,
        tipoPago: tipoPago,
        pagado: canc,
        cambio:
          Number(canc) - (Number(datos.totalDescontado) - Number(giftCard)),
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: "",
        importeBase: Number(Number(datos.totalDescontado) - giftCard).toFixed(
          2
        ),
        debitoFiscal: Number(
          (roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard) * 0.13
        ).toFixed(2),
        desembolsada: 0,
        autorizacion: uniqueId,
        cufd: "",
        fechaEmision: "",
        nroTransaccion: 0,
        idOtroPago: ofp,
        vale: giftCard,
        aPagar: aPagar,
        puntoDeVenta: pointOfSale,
        idAgencia: userData.userStore,
        voucher: voucher,
        pya: isPya,
      };
      console.log(
        "TESTEANDO DATOS",
        cancelado,
        datos.totalDescontado,
        giftCard
      );
      const emizorBody = {
        numeroFactura: 0,
        nombreRazonSocial: datos.razonSocial,
        codigoPuntoVenta: parseInt(pointOfSale),
        fechaEmision: "",
        cafc: "",
        codigoExcepcion: 0,
        descuentoAdicional: Number(descAdicional.toFixed(2)),
        montoGiftCard: 0,
        codigoTipoDocumentoIdentidad: tipoDocumento,
        numeroDocumento: datos.nit == 0 ? "1000001" : `${datos.nit}`,
        complemento: "",
        codigoCliente: `${clientId}`,
        codigoMetodoPago: tipoPago,
        numeroTarjeta: nroTarjeta.length == 16 ? nroTarjeta : "",
        montoTotal: Number(
          Number(
            roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard
          ).toFixed(2)
        ),
        codigoMoneda: 1,
        tipoCambio: 1,
        montoTotalMoneda: Number(
          Number(
            roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard
          ).toFixed(2)
        ),
        usuario: userData.userName,
        emailCliente: clientEmail,
        telefonoCliente: "",
        extras: { facturaTicket: uniqueId },
        codigoLeyenda: 0,
        montoTotalSujetoIva: Number(
          Number(roundToTwoDecimalPlaces(datos.totalDescontado)) - giftCard
        ).toFixed(2),
        tipoCambio: 1,
        detalles: productos,
      };
      const composedBody = {
        venta: saleBodyNew,
        invoice: invoiceBodyNew,
        emizor: emizorBody,
        stock: updateStockBody,
        storeInfo: storeInfo,
      };
      console.log("Facturar body", invoiceBodyNew);
      try {
        const invocieResponse = await debouncedFullInvoiceProcess(composedBody);
        console.log("Respuesta de la fac", invocieResponse);
        if (invocieResponse.data.code === 200) {
          const parsed = JSON.parse(invocieResponse.data.data).data.data;
          console.log("Datos recibidos", parsed);
          if (parsed.emission_type_code === 1) {
            setNoFactura(parsed.numeroFactura);
            saveNewEmail(parsed.cuf);
            setLeyenda(invocieResponse.data.leyenda);
            setUrlSin(parsed.urlSin);
          } else {
            if (isMobile) {
              setOfflineText(`"Este documento es la Representación Gráfica de un Documento Fiscal
              Digital emitido en una modalidad de facturación fuera de línea"`);
              setNoFactura(parsed.numeroFactura);
              saveNewEmail(parsed.cuf);
              setLeyenda(invocieResponse.data.leyenda);
              setUrlSin(parsed.urlSin);
            } else {
              console.log("Factura fuera de linea", parsed.shortLink);
              setNoFactura(parsed.numeroFactura);
              downloadAndPrintFile(parsed.shortLink, parsed.numeroFactura);
              setAlertSec(
                "El servicio del SIN se encuentra no disponible, puede escanear el qr de esta nota para ir a su factura en las siguientes horas, muchas gracias"
              );
              setIsAlertSec(true);
              setTimeout(() => {
                Cookies.remove("nit");
                window.location.reload();
              }, 5000);
            }
          }
        } else {
          await debouncedFullInvoiceProcess.cancel();
          console.log("Cancel debounced");
          if (invocieResponse.data.code === 500) {
            setIsAlertSec(false);
            setAlert(`${invocieResponse.data.message}`);
            setIsAlert(true);
          } else {
            const error = JSON.parse(invocieResponse.data.error);
            console.log("Error", error);
            const errors = error.data?.errors;
            console.log("TCL: cancelInvoice -> errors", errors);
            setIsAlertSec(false);
            var errorList = [];
            for (let key in errors) {
              if (errors.hasOwnProperty(key)) {
                console.log(key + ": " + errors[key]);
                errorList.push(`${errors[key]}.\n`);
              }
            }
            setAlert("Error al facturar\n", errorList);
            console.log("Lista de errores", errorList);
            setAlert(
              "Error al facturar:\n" +
                errorList.map((item) => {
                  return item + `\n`;
                })
            );
            setIsAlert(true);
            //setAlert(`${invocieResponse.data.message} : ${error}`);
          }
        }
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          setAlert(
            "Error de conexión, espere 40 segundos e intente nuevamente"
          );
          setTimeout(async () => {
            const getInovice = await emizorService.getFactura(uniqueId);
            console.log("TCL: invoicingProcess -> getInovice", getInovice);
            await downloadAndPrintFile(
              getInovice.data.cufd,
              getInovice.data.nroFactura,
              getInovice.data.nitCliente
            );
          }, 30000);
        }
        await debouncedFullInvoiceProcess.cancel();
        setIsAlertSec(false);
        setAlert("Error al facturar ", error);
        setIsAlert(true);
      }
    }
  }

  const downloadAndPrintFile = async (url, numeroFactura) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const urlObject = URL.createObjectURL(blob);

    // Download PDF
    const downloadLink = document.createElement("a");
    downloadLink.href = urlObject;
    downloadLink.download = `factura-${numeroFactura}.pdf`; // Set the desired filename and extension
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Print PDF
    const printPDF = () => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = urlObject;

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.print();
        }, 1000); // Adjust the delay if needed
      };

      document.body.appendChild(iframe);
    };

    // Check if the device is mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // For mobile devices, directly print PDF
      printPDF();
    } else {
      // For desktop devices, open new window for printing
      const newWindow = window.open(urlObject);

      if (newWindow) {
        newWindow.onload = () => {
          URL.revokeObjectURL(urlObject);
          newWindow.print();
          // Optional: Close the window after printing
          // newWindow.close();
        };
      } else {
        // Prompt the user to enable pop-ups manually
        window.alert(
          "Por favor, habilite las ventanas emergentes para imprimir el archivo automáticamente"
        );
      }
    }
  };

  function handleClose() {
    setIsInvoice(false);
    setIsSaleModal(false);
  }

  function registerOnlineSale() {
    console.log("REGISTRANDO VENTA ONLINE");
    const saleBodyNew = {
      pedido: {
        idUsuarioCrea: userData.userId,
        idCliente: clientId,
        fechaCrea: dateString(),
        fechaActualizacion: dateString(),
        montoTotal: datos.total,
        descuento: datos.descuento,
        descCalculado: Number(datos.descuentoCalculado) + Number(giftCard),
        montoFacturar: Number(datos.totalDescontado) - giftCard,
        idPedido: "",
        idFactura: 0,
      },
      productos: selectedProducts,
    };

    const invoiceBodyNew = {
      idCliente: clientId,
      nroFactura: invoiceNumber,
      idSucursal: 0,
      nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
      fechaHora: onlineDate.fechaHora,
      nitCliente: datos.nit,
      razonSocial: datos.razonSocial,
      tipoPago: tipoPago,
      pagado: datos.totalDescontado,
      cambio: 0,
      cuf: "",
      importeBase: Number(datos.totalDescontado),
      debitoFiscal: Number(
        roundToTwoDecimalPlaces(datos.totalDescontado) * 0.13
      ).toFixed(2),
      desembolsada: 0,
      autorizacion: uniqueId,
      nroTarjeta: "-",
      cufd: "",
      fechaEmision: onlineDate.emision,
      nroTransaccion: 0,
      idOtroPago: ofp,
      vale: 0,
      aPagar: aPagar,
      puntoDeVenta: 10,
      idAgencia: userData.userStore,
      voucher: voucher,
      pya: isPya,
    };
    return new Promise(async (resolve, reject) => {
      try {
        const onlineAdded = await onlineInvoiceProcess({
          invoiceBody: invoiceBodyNew,
          saleBody: saleBodyNew,
        });
        resolve(onlineAdded);
      } catch (err) {
        reject(err);
      }
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

    // Instead of directly saving the PDF, create a download link
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = pdfUrl;
    downloadLink.download = `factura-${noFactura}-${datos.nit}.pdf`;
    document.body.appendChild(downloadLink);

    // Trigger a click on the download link
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(pdfUrl);

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
    pdf.save(`nota_entrega_${dropId}.pdf`);
  };

  function saveEmail() {
    setIsNewEmail(false);
    const updatedEmail = updateClientEmail({
      idClient: clientId,
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

  function handleOnlineDate(value) {
    const formatted = formatDate(value).fullDate;
    const obj = {
      fechaHora: `${formatted} 00:00:00`,
      emision: `${value} 00:00:00`,
    };
    setOnlineDate(obj);
  }

  return (
    <div>
      <ToastComponent
        show={ping}
        setShow={setPing}
        text={pingError}
        autoclose={10}
        type="danger"
        position="bottom-center"
      />
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
                    invoice={{
                      nitCliente: datos.nit,
                      razonSocial: datos.razonSocial,
                      nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                    }}
                    paymentData={{
                      tipoPago: stringPago,
                      cancelado: canc,
                      cambio:
                        Number(canc) +
                        Number(voucher) -
                        Number(roundToTwoDecimalPlaces(datos.totalDescontado)) +
                        Number(giftCard),
                      fechaHora: dateString(),
                    }}
                    totalsData={{
                      total: datos.total,
                      descuentoCalculado: isRoute
                        ? datos.descuentoCalculado
                        : descuentoFactura,
                      totalDescontado:
                        roundToTwoDecimalPlaces(datos.totalDescontado) -
                        giftCard,
                    }}
                    giftCard={giftCard}
                    invoiceNumber={noFactura}
                    leyenda={leyenda}
                    urlSin={urlSin}
                    offlineText={offlineText}
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
                  invoice={{
                    nitCliente: datos.nit,
                    razonSocial: datos.razonSocial,
                    nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                  }}
                  paymentData={{
                    tipoPago: stringPago,
                    cancelado: canc,
                    cambio:
                      Number(canc) -
                      Number(roundToTwoDecimalPlaces(datos.totalDescontado)) +
                      Number(giftCard),
                    fechaHora: dateString(),
                  }}
                  totalsData={{
                    total: datos.total,
                    descuentoCalculado: isRoute
                      ? datos.descuentoCalculado
                      : descuentoFactura,
                    totalDescontado:
                      roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard,
                  }}
                  invoiceNumber={noFactura}
                  leyenda={leyenda}
                  urlSin={urlSin}
                  offlineText={offlineText}
                />
                <InvoiceComponentCopy
                  ref={componentCopyRef}
                  branchInfo={branchInfo}
                  selectedProducts={selectedProducts}
                  cuf={cuf}
                  invoice={{
                    nitCliente: datos.nit,
                    razonSocial: datos.razonSocial,
                    nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                  }}
                  paymentData={{
                    tipoPago: stringPago,
                    cancelado: canc,
                    cambio:
                      Number(canc) -
                      Number(roundToTwoDecimalPlaces(datos.totalDescontado)) +
                      Number(giftCard),
                    fechaHora: dateString(),
                  }}
                  totalsData={{
                    total: datos.total,
                    descuentoCalculado: isRoute
                      ? datos.descuentoCalculado
                      : descuentoFactura,
                    totalDescontado:
                      roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard,
                  }}
                  invoiceNumber={noFactura}
                  leyenda={leyenda}
                  urlSin={urlSin}
                  offlineText={offlineText}
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
              onAfterPrint={() => {
                handleDownloadPdfDrop();
                setTimeout(() => {
                  Cookies.remove("nit");
                  window.location.reload();
                }, 5000);
              }}
            />
            <Button>
              <DropComponent
                ref={dropRef}
                branchInfo={branchInfo}
                selectedProducts={selectedProducts}
                cliente={{
                  nit: datos.nit,
                  razonSocial: datos.razonSocial,
                }}
                dropId={dropId}
                total={roundToTwoDecimalPlaces(datos.totalDescontado)}
                vale={giftCard}
                motivo={`${motivo} - ${motivoDetalle}`}
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
              nit: datos.nit,
              razonSocial: datos.razonSocial,
            }}
            dropId={dropId}
            total={roundToTwoDecimalPlaces(datos.totalDescontado)}
            vale={giftCard}
          />
        </div>
      ) : null}

      <Modal show={isSaleModal} size="lg">
        <Form onSubmit={validateFormOfPayment}>
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
              <div className="modalData">{`${Number(datos.total).toFixed(
                2
              )} Bs.`}</div>
            </div>
            <div className="modalRows">
              <div className="modalLabel"> Descuento:</div>
              <div className="modalData">
                {(
                  Number(giftCard != "" ? giftCard : 0) +
                  Number(datos.descuentoCalculado)
                ).toFixed(2)}
              </div>
            </div>
            <div className="modalRows">
              <div className="modalLabel"> Total a pagar:</div>
              <div className="modalData">{`${Number(
                tipoPago == 4
                  ? roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard
                  : roundToTwoDecimalPlaces(datos.totalDescontado)
              ).toFixed(2)} Bs.`}</div>
            </div>
            <div className="modalRows">
              <div className="modalLabel">
                {" "}
                {auxClientEmail === ""
                  ? "Ingrese correo del cliente:"
                  : "Correo del cliente:"}
              </div>
              <div className="modalData">
                {" "}
                <Form.Control
                  disabled={auxClientEmail !== "" || datos.nit == "0"}
                  type="email"
                  value={clientEmail}
                  isInvalid={!isEmailValid && auxClientEmail === ""}
                  onChange={(e) => handleEmail(e.target.value)}
                />
                <span style={{ color: "red", fontSize: "smaller" }}>
                  {!isEmailValid && auxClientEmail === ""
                    ? "Ingrese un correo válido o deje el espacio vacio"
                    : ""}
                </span>
              </div>
            </div>

            <div className="modalRows">
              <div className="modalLabel">Pedidos Ya:</div>
              <div className="modalData">
                <Form.Check
                  type="checkbox"
                  value={isPya}
                  onChange={() => {
                    setIsPya(!isPya);
                    setVoucher(0);
                  }}
                  checked={isPya}
                />
              </div>
            </div>
            {isPya ? (
              <div className="modalRows">
                <div className="modalLabel">Voucher Ped. Ya:</div>
                <div className="modalData">
                  <Form.Control
                    type="number"
                    value={voucher}
                    disabled={!isPya}
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                </div>
              </div>
            ) : null}

            <div className="modalRows">
              <div className="modalLabel"> Tipo de pago:</div>
              <div className="modalData">
                <div>
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
                </div>
              </div>
            </div>

            {tipoPago == 5 ? (
              <div>
                <div className="modalRows">
                  <div className="modalLabel"> Otro Tipo de pago:</div>
                  <div className="modalData">
                    <div>
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
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {tipoPago == 1 ? (
              <div>
                <div className="modalRows">
                  <div className="modalLabel"> Monto cancelado:</div>
                  <div className="modalData">
                    <div>
                      <Form.Control
                        ref={canceledRef}
                        value={cancelado}
                        onChange={(e) =>
                          !isNaN(e.target.value) && setCancelado(e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" ? validateFormOfPayment(e) : null
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modalRows">
                  <div className="modalLabel"> Cambio:</div>
                  <div className="modalData">{`${
                    Number(canc) -
                      Number(roundToTwoDecimalPlaces(datos.totalDescontado)) +
                      Number(voucher) <
                    0
                      ? `Ingrese un monto igual o superiores al total`
                      : `${(
                          Number(canc) -
                          Number(
                            roundToTwoDecimalPlaces(datos.totalDescontado)
                          ) +
                          Number(voucher)
                        ).toFixed(2)} Bs.`
                  } `}</div>
                </div>
              </div>
            ) : tipoPago == 2 ? (
              <div className="modalRows">
                <div className="modalLabel"> Numeros tarjeta:</div>
                <div className="modalData">
                  {
                    <div className="cardLayout">
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
                    </div>
                  }
                </div>
              </div>
            ) : tipoPago == 10 ? (
              <div>
                <div className="modalRows">
                  <div className="modalLabel">
                    {" "}
                    Monto cancelado en efectivo:
                  </div>
                  <div className="modalData">
                    <div>
                      <Form.Control
                        ref={canceledRef}
                        value={cancelado}
                        type="number"
                        onChange={(e) => setCancelado(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" ? validateFormOfPayment(e) : null
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modalRows">
                  <div className="modalLabel"> A cobrar con tarjeta:</div>
                  <div className="modalData">{`${(
                    -cancelado +
                    Number(roundToTwoDecimalPlaces(datos.totalDescontado))
                  ).toFixed(2)} Bs.`}</div>
                </div>
                <div className="modalRows">
                  <div className="modalLabel"> Numeros tarjeta:</div>
                  <div className="modalData">
                    {
                      <div className="cardLayout">
                        <Form.Control
                          ref={numberARef}
                          type="text"
                          onChange={(e) =>
                            handleCardNumber(e.target.value, "A")
                          }
                          value={cardNumbersA}
                        ></Form.Control>
                        <div className="modalHyphen">{"-"}</div>
                        <Form.Control
                          ref={numberBRef}
                          min="0000"
                          max="9999"
                          type="number"
                          onChange={(e) =>
                            handleCardNumber(e.target.value, "B")
                          }
                          value={cardNumbersB}
                          onKeyDown={(e) =>
                            e.key === "Enter" ? validateFormOfPayment(e) : null
                          }
                        ></Form.Control>
                      </div>
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
                {datos.total - giftCard <= 0 ? (
                  <div>
                    <div className="modalRows">
                      <div className="modalLabel"> Detalle:</div>
                      <div className="modalData">{"Dando de baja el vale"}</div>
                    </div>
                  </div>
                ) : (
                  <TipoPagoComponent
                    otherPayment={otherPayments}
                    setValeForm={setValeForm}
                    total={datos.totalDescontado}
                    setVale={setGiftCard}
                    vale={giftCard}
                  />
                )}
              </div>
            ) : null}
            {tipoPago == 11 ? (
              <div className="modalRows">
                <div className="modalLabel"> Motivo de la Baja:</div>
                <div className="modalData">
                  {
                    <Form.Select onChange={(e) => setMotivo(e.target.value)}>
                      <option>Seleccione Motivo</option>
                      <option value="socio">Socio</option>
                      <option value="muestra">Muestra</option>
                      <option value="online">Venta en línea</option>
                    </Form.Select>
                  }
                </div>
              </div>
            ) : null}
            {tipoPago == 11 ? (
              <div className="modalRows">
                <div className="modalLabel"> Detalle del motivo:</div>
                <div className="modalData">
                  {
                    <div>
                      <Form.Control
                        value={motivoDetalle}
                        as="textarea"
                        rows={3}
                        onChange={(e) => {
                          (motivoDetalle.length < 100 ||
                            motivoDetalle >= e.target.value) &&
                            setMotivoDetalle(e.target.value);
                        }}
                      />
                      <div>{`${
                        100 - motivoDetalle.length
                      } Caracteres restantes`}</div>
                    </div>
                  }
                </div>
              </div>
            ) : null}
            {tipoPago == 11 && motivo == "online" ? (
              <div className="modalRows">
                <div className="modalLabel"> Numero de factura:</div>
                <div className="modalData">
                  {
                    <Form.Control
                      type="number"
                      required
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  }
                </div>
              </div>
            ) : null}
            {tipoPago == 11 && motivo == "online" ? (
              <div className="modalRows">
                <div className="modalLabel"> Fecha en la factura:</div>
                <div className="modalData">
                  {
                    <Form.Control
                      type="date"
                      required
                      onChange={(e) => handleOnlineDate(e.target.value)}
                    />
                  }
                </div>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="success">
              {1 > 0 && datos.total - giftCard <= 0
                ? "Dar de baja"
                : "Facturar"}
            </Button>
            <Button type="reset" variant="danger" onClick={() => handleClose()}>
              {" "}
              Cancelar
            </Button>
          </Modal.Footer>
        </Form>
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
                nitCliente: datos.nit,
                razonSocial: datos.razonSocial,
                nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
              }}
              paymentData={{
                tipoPago: stringPago,
                cancelado: canc,
                cambio:
                  Number(canc) -
                  Number(roundToTwoDecimalPlaces(datos.totalDescontado)) +
                  Number(giftCard),
                fechaHora: dateString(),
              }}
              totalsData={{
                total: datos.total,
                descuentoCalculado: isRoute
                  ? datos.descuentoCalculado
                  : descuentoFactura,
                totalDescontado:
                  roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard,
              }}
              invoiceNumber={noFactura}
              leyenda={leyenda}
              urlSin={urlSin}
              offlineText={offlineText}
            />
            <InvoiceComponentCopy
              ref={componentCopyRef}
              branchInfo={branchInfo}
              selectedProducts={selectedProducts}
              cuf={cuf}
              invoice={{
                nitCliente: datos.nit,
                razonSocial: datos.razonSocial,
                nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
              }}
              paymentData={{
                tipoPago: stringPago,
                cancelado: canc,
                cambio:
                  Number(canc) -
                  Number(roundToTwoDecimalPlaces(datos.totalDescontado)) +
                  Number(giftCard),
                fechaHora: dateString(),
              }}
              totalsData={{
                total: datos.total,
                descuentoCalculado: isRoute
                  ? datos.descuentoCalculado
                  : descuentoFactura,
                totalDescontado:
                  roundToTwoDecimalPlaces(datos.totalDescontado) - giftCard,
              }}
              invoiceNumber={noFactura}
              leyenda={leyenda}
              urlSin={urlSin}
              offlineText={offlineText}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default React.forwardRef(SaleModalNew);
