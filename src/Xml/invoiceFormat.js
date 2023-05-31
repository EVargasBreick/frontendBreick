import xml2js from "xml2js";

function formatInvoiceProducts(products) {
  const detalleArray = [];
  for (const product of products) {
    const prodObj = {
      codigoActividadSin: 107900,
      codigoProductoSin: 99100,
      codigoProducto: product.codInterno,
      descripcion: product.nombreProducto,
      cantidad: parseFloat(parseFloat(product.cantProducto).toFixed(2)),
      unidadMedida: product.codigoUnidad,
      precioUnitario: parseFloat(
        parseFloat(product.precioDeFabrica).toFixed(2)
      ),
      montoDescuento: 0,
      subTotal:
        product.totalProd != undefined
          ? parseFloat(parseFloat(product.totalProd).toFixed(2))
          : parseFloat(parseFloat(product.total).toFixed(2)),
      numeroSerie: "",
      numeroImei: "",
    };
    detalleArray.push(prodObj);
  }
  return detalleArray;
}

function generateInvoiceJson(data) {
  console.log("Descuento en funcion bien adentro", data.descuento);
  const detalleArray = [];
  data.products.map((product) => {
    const prodObj = {
      actividadEconomica: 107900,
      codigoProductoSin: 99100,
      codigoProducto: product.codInterno,
      descripcion: product.nombreProducto,
      cantidad: parseFloat(product.cantProducto).toFixed(2),
      unidadMedida: product.codigoUnidad,
      precioUnitario: product.precioDeFabrica,
      montoDescuento: 0,
      subTotal:
        product.totalProd != undefined
          ? parseFloat(product.totalProd).toFixed(2)
          : parseFloat(product.total).toFixed(2),
      numeroSerie: {
        $: {
          "xsi:nil": true,
        },
      },
      numeroImei: {
        $: {
          "xsi:nil": true,
        },
      },
    };
    console.log("Producto ya modificado", prodObj);
    detalleArray.push(prodObj);
  });
  console.log("Test", data.montoFacturar + data.montoGiftCard);
  const xmlJson = {
    Comprobantes: {
      Comprobante: {
        informacionOrganismo: {
          facturaElectronicaCompraVenta: {
            $: {
              "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
              "xsi:noNamespaceSchemaLocation":
                "facturaElectronicaCompraVenta.xsd",
            },
            cabecera: {
              nitEmisor: data.nitEmisor,
              razonSocialEmisor: data.razonSocialEmisor,
              municipio: data.municipio,
              telefono: data.telefonoEmpresa,
              numeroFactura: data.numeroFactura,
              cuf: "",
              cufd: "",
              codigoSucursal: data.codigoSucursal,
              direccion: data.direccion,
              codigoPuntoVenta: data.codigoPuntoVenta,
              fechaEmision: data.fechaEmision,
              nombreRazonSocial: data.razonSocialCliente,
              codigoTipoDocumentoIdentidad: data.tipoDocumento,
              numeroDocumento: data.nitCliente,
              complemento: {
                $: {
                  "xsi:nil": true,
                },
              },
              codigoCliente: data.codigoCliente,
              codigoMetodoPago: data.codigoMetodoPago,
              numeroTarjeta:
                data.numeroTarjeta != ""
                  ? data.numeroTarjeta
                  : {
                      $: {
                        "xsi:nil": true,
                      },
                    },
              montoTotal: parseFloat(data.montoFacturar).toFixed(2),

              montoTotalSujetoIva: parseFloat(data.montoFacturar).toFixed(2),
              codigoMoneda: data.codigoMoneda,
              tipoCambio: data.tipoCambio,
              montoTotalMoneda: parseFloat(data.montoTotalMoneda).toFixed(2),
              montoGiftCard: parseFloat(data.montoGiftCard).toFixed(2),
              descuentoAdicional: parseFloat(data.descuento).toFixed(2),
              codigoExcepcion: 0,
              cafc: {
                $: {
                  "xsi:nil": true,
                },
              },
              leyenda: data.leyenda,
              usuario: data.nombreUsuario,
              codigoDocumentoSector: 1,
            },
            detalle: detalleArray,
          },
        },
        /* informacionComfiar: {
          nitEmisor: data.nitEmpresa,
          numeroFactura: data.numeroFactura,
          codigoSucursal: data.codigoSucursal,
          puntoDeVenta: 0,
          codigoTipoFactura: 1,
          RolEmisorId: null,
          RolReceptorId: null,
          TextosLibres: {
            TextoLibre1: "",
          },
          Receptores: null,
        },*/
      },
    },
  };
  return xmlJson;
}
function convertJsonToXml(json) {
  const options = {
    xmldec: {
      version: "1.0",
      encoding: "UTF-8",
    },
  };
  const builder = new xml2js.Builder(options);
  const xml = builder.buildObject(json);
  return xml;
}
export { generateInvoiceJson, convertJsonToXml, formatInvoiceProducts };
