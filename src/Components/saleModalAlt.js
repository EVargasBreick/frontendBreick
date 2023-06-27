import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image, FormControl } from "react-bootstrap";
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
  debouncedFullInvoiceProcess,
  deleteInvoice,
  fullInvoiceProcess,
  invoiceUpdate,
  logIncompleteInvoice,
} from "../services/invoiceServices";
import { deleteSale } from "../services/saleServices";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { formatInvoiceProducts } from "../Xml/invoiceFormat";
import { updateClientEmail } from "../services/clientServices";
import { v4 as uuidv4 } from "uuid";
import { emizorService } from "../services/emizorService";
function SaleModalAlt(
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
    ofp,
    setOfp,
    aPagar,
    setAPagar,
    isRoute,
    saleBody,
    invoiceBody,
    updateStockBody,
    emailCliente,
    clientId,
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
  const [clientEmail, setClientEmail] = useState(emailCliente);
  const [transactionId, setTransactionId] = useState("");
  const [invoiceNubmer, setInvoiceNumber] = useState("");
  const [invObj, setInvObj] = useState({});
  const [idFactura, setIdFactura] = useState("");
  const [noFactura, setNoFactura] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [auxClientEmail] = useState(emailCliente);
  const [isNewEmail, setIsNewEmail] = useState(false);
  const [altCuf, setaltCuf] = useState("");
  const [leyenda, setLeyenda] = useState("");
  const [urlSin, setUrlSin] = useState("");
  const [giftCard, setGiftCard] = useState(0);
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  const uniqueId = uuidv4();
  const isMobile = isMobileDevice();
  console.log("Data del branch", branchInfo);
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
              if (cancelado <= totalDescontado - giftCard) {
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
    console.log("Sale body", saleBody.pedido);
    console.log("Unique id", uniqueId);
    const emailValidated = validateEmail();
    if (emailValidated) {
      setAlertSec("Obteniendo datos de factura");
      setIsAlertSec(true);
      const storeInfo = {
        nroSucursal: branchInfo.nro,
        puntoDeVenta: pointOfSale,
      };
      const descAdicional =
        parseFloat(descuentoCalculado) + parseFloat(giftCard);
      const nroTarjeta = `${cardNumbersA}00000000${cardNumbersB}`;
      const productos = formatInvoiceProducts(selectedProducts);

      const saleBodyNew = {
        pedido: {
          idUsuarioCrea: saleBody.pedido.idUsuarioCrea,
          idCliente: saleBody.pedido.idCliente,
          fechaCrea: saleBody.pedido.fechaCrea,
          fechaActualizacion: saleBody.pedido.fechaActualizacion,
          montoTotal: saleBody.pedido.montoTotal,
          descuento: saleBody.pedido.descuento,
          descCalculado:
            parseFloat(saleBody.pedido.descCalculado) + parseFloat(giftCard),
          montoFacturar:
            parseFloat(saleBody.pedido.montoFacturar) - parseFloat(giftCard),
          idPedido: "",
          idFactura: 0,
        },
        productos: saleBody.productos,
      };
      const invoiceBodyNew = {
        idCliente: invoiceBody.idCliente,
        nroFactura: invoiceBody.nroFactura,
        idSucursal: invoiceBody.idSucursal,
        nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
        fechaHora: invoiceBody.fechaHora,
        nitCliente: invoiceBody.nitCliente,
        razonSocial: invoiceBody.razonSocial,
        tipoPago: tipoPago,
        pagado: cancelado,
        cambio: cancelado - parseFloat(totalDescontado - giftCard).toFixed(2),
        nroTarjeta: `${cardNumbersA}-${cardNumbersB}`,
        cuf: "",
        importeBase: parseFloat(totalDescontado - giftCard).toFixed(2),
        debitoFiscal: parseFloat((totalDescontado - giftCard) * 0.13).toFixed(
          2
        ),
        desembolsada: 0,
        autorizacion: `${dateString()}|${invoiceBody.puntoDeVenta}|${
          invoiceBody.idAgencia
        }`,
        cufd: "",
        fechaEmision: "",
        nroTransaccion: 0,
        idOtroPago: ofp,
        vale: giftCard,
        aPagar: aPagar,
        puntoDeVenta: invoiceBody.puntoDeVenta,
        idAgencia: invoiceBody.idAgencia,
      };
      const emizorBody = {
        numeroFactura: 0,
        nombreRazonSocial: datos.razonSocial,
        codigoPuntoVenta: parseInt(pointOfSale),
        fechaEmision: "",
        cafc: "",
        codigoExcepcion: 0,
        descuentoAdicional: parseFloat(descAdicional.toFixed(2)),
        montoGiftCard: 0,
        codigoTipoDocumentoIdentidad: tipoDocumento,
        numeroDocumento: datos.nit == 0 ? "1000001" : `${datos.nit}`,
        complemento: "",
        codigoCliente: `${clientId}`,
        codigoMetodoPago: tipoPago,
        numeroTarjeta: nroTarjeta.length == 16 ? nroTarjeta : "",
        montoTotal: parseFloat(
          parseFloat(totalDescontado - giftCard).toFixed(2)
        ),
        codigoMoneda: 1,
        tipoCambio: 1,
        montoTotalMoneda: parseFloat(
          parseFloat(totalDescontado - giftCard).toFixed(2)
        ),
        usuario: userName,
        emailCliente: clientEmail,
        telefonoCliente: "",
        extras: { facturaTicket: uniqueId },
        codigoLeyenda: 0,
        montoTotalSujetoIva: parseFloat(
          parseFloat(parseFloat(totalDescontado) - giftCard).toFixed(2)
        ),
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
            console.log("Factura fuera de linea", parsed.shortLink);
            setNoFactura(parsed.numeroFactura);
            downloadAndPrintFile(parsed.shortLink, parsed.numeroFactura);
            setAlertSec(
              "El servicio del SIN se encuentra no disponible, puede escanear el qr de esta nota para ir a su factura en las siguientes horas, muchas gracias"
            );
            setIsAlertSec(true);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
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

    const link = document.createElement("a");
    link.href = urlObject;
    link.download = `factura-${numeroFactura}-${datos.nit}.pdf`; // Set the desired filename and extension
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return newWindow;
  };
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
    pdf.save(`factura-${noFactura}-${datos.nit}.pdf`);
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
              onChange={(e) => handleEmail(e.target.value)}
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
                    invoice={{
                      nitCliente: datos.nit,
                      razonSocial: datos.razonSocial,
                      nitEmpresa: process.env.REACT_APP_NIT_EMPRESA,
                    }}
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
                    invoiceNumber={noFactura}
                    leyenda={leyenda}
                    urlSin={urlSin}
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
                  invoiceNumber={noFactura}
                  leyenda={leyenda}
                  urlSin={urlSin}
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
                  invoiceNumber={noFactura}
                  leyenda={leyenda}
                  urlSin={urlSin}
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
                  window.location.reload();
                }, 3000);
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
              <div className="modalData">{`${parseFloat(
                totalDescontado
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
                  disabled={auxClientEmail !== ""}
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
                  <div className="modalLabel"> Monto cancelado:</div>
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
                    -cancelado + parseFloat(totalDescontado)
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
                              e.key === "Enter"
                                ? validateFormOfPayment(e)
                                : null
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
                    <Form.Select onChange={(e) => setMotivo(e.target.value)}>
                      <option>Seleccione Motivo</option>
                      <option value="socio">Socio</option>
                      <option value="vale">Vale</option>
                      <option value="promo">Promoción</option>
                      <option value="muestra">Muestra</option>
                      <option value="muestra">Venta en línea</option>
                    </Form.Select>
                  }
                </div>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="success">
              Facturar
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
              invoiceNumber={noFactura}
              leyenda={leyenda}
              urlSin={urlSin}
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
              invoiceNumber={noFactura}
              leyenda={leyenda}
              urlSin={urlSin}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default React.forwardRef(SaleModalAlt);
