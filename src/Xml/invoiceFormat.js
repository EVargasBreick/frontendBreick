import xml2js from "xml2js";

function generateInvoiceJson(data) {
  const detalleArray = [];
  data.products.map((product) => {
    const prodObj = {
      actividadEconomica: product.actividadEconomica,
      codigoProductoSin: product.codigoSin,
      codigoProducto: product.codInterno,
      descripcion: product.nombreProducto,
      cantidad: parseFloat(product.cantProducto).toFixed(2),
      unidadMedida: product.codigoUnidad,
      precioUnitario: product.precioDeFabrica,
      montoDescuento: parseFloat(product.descuentoProd).toFixed(2),
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
    detalleArray.push(prodObj);
  });

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
              montoTotalSujetoIva: parseFloat(
                data.montoFacturar - data.montoGiftCard
              ).toFixed(2),
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
export { generateInvoiceJson, convertJsonToXml };
