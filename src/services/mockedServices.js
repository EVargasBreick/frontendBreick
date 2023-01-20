import { convertJsonToXml, generateInvoiceJson } from "../Xml/invoiceFormat";
import { SoapLastId } from "../Xml/soapLastId";
import { dateString } from "./dateServices";

function getInvoiceNumber(body) {
  console.log("Body recibido", body);
  return new Promise((resolve, reject) => {
    const lastId = SoapLastId(body);
    lastId
      .then((res) => {
        console.log("Respuesta exitosa del id", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("Error obteniendo el ultimo id", err);
        reject(err);
      });
  });
}

function structureXml(
  products,
  branchInfo,
  tipoPago,
  totalDescontado,
  descuentoCalculado,
  invoice,
  nroFac,
  nroTarjeta,
  user,
  tipoDocumento
) {
  const current = new Date();
  const formatted = current.toISOString();
  const parts = formatted.split("Z");
  return new Promise((resolve, reject) => {
    const dataObj = {
      nitEmisor: invoice.nitEmpresa,
      razonSocialEmisor: "INCADEX S.R.L.",
      municipio: branchInfo.ciudad,
      telefonoEmpresa: branchInfo.tel,
      numeroFactura: nroFac,
      codigoSucursal: branchInfo.nro,
      direccion: branchInfo.dir,
      codigoPuntoVenta: 0,
      fechaEmision: parts[0],
      razonSocialCliente: invoice.razonSocial,
      tipoDocumento: tipoDocumento,
      nitCliente: invoice.nitCliente,
      codigoCliente: invoice.idCliente,
      codigoMetodoPago: tipoPago,
      numeroTarjeta: nroTarjeta.length == 16 ? nroTarjeta : "",
      montoFacturar: totalDescontado,
      codigoMoneda: 1,
      tipoCambio: 1,
      montoTotalMoneda: totalDescontado,
      montoGiftCard: 0,
      descuento: descuentoCalculado,
      leyenda: `Ley Nº 453: El proveedor debe brindar atención sin discriminación, con respeto, calidez y cordialidad a los usuarios`,
      nombreUsuario: user,
      products: products,
    };
    const invoiceJson = generateInvoiceJson(dataObj);
    const xmlResultante = convertJsonToXml(invoiceJson);
    resolve(xmlResultante);
  });
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { getInvoiceNumber, structureXml };
