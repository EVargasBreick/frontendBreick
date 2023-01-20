import xml2js from "xml2js";

function generateInvoiceJson(data) {
  const detalleArray = [];
  data.products.map((product) => {
    const prodObj = {
      actividadEconomica: product.actividadEconomica,
      codigoProductoSin: product.codigoSin,
      codigoProducto: product.codInterno,
      descripcion: product.nombreProducto,
      cantidad: product.cantProducto,
      unidadMedida: product.codigoUnidad,
      precioUnitario: product.precioDeFabrica,
      montoDescuento: product.descuentoProd,
      subTotal:
        product.totalProd != undefined ? product.totalProd : product.total,
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
              montoTotal: data.montoFacturar,
              montoTotalSujetoIva: data.montoFacturar - data.montoGiftCard,
              codigoMoneda: data.codigoMoneda,
              tipoCambio: data.tipoCambio,
              montoTotalMoneda: data.montoTotalMoneda,
              montoGiftCard: data.montoGiftCard,
              descuentoAdicional: data.descuento,
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
