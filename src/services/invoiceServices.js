import axios from "axios";
import config from "../config.json";
import { dateString } from "./dateServices";
import { updateInvoicedOrder } from "./orderServices";

import { createSale } from "./saleServices";

const createInvoice = (invoiceObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.endpointUrl}:${config.endpointPort}/factura`,
        invoiceObject
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteInvoice = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.endpointUrl}:${config.endpointPort}/factura?id=${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function saveInvoice(
  cuf,
  nro,
  sucursal,
  cliente,
  cancelado,
  cambio,
  cardNumbersA,
  cardNumbersB,
  tipoPago,
  desembolsada,
  montoTotal,
  descuento,
  descuentoCalculado,
  montoFacturar,
  idUsuarioCrea,
  idCliente,
  idPedido,
  products,
  fechaHora
) {
  return new Promise((resolve, reject) => {
    const invoiceBody = {
      nroFactura: nro,
      idSucursal: sucursal.idImpuestos,
      nitEmpresa: config.nitEmpresa,
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
      desembolsada: desembolsada,
    };
    const newInvoice = createInvoice(invoiceBody);
    newInvoice
      .then((res) => {
        console.log("Respuesta de creacion de la factura", res);
        const newId = res.data.idCreado;
        const created = saveSaleFromOrder(
          newId,
          montoTotal,
          descuento,
          descuentoCalculado,
          montoFacturar,
          idUsuarioCrea,
          idCliente,
          idPedido,
          products,
          fechaHora
        );
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
    console.log("Cancelado:", cancelado);
    console.log("Cambio", cambio);
  });
}

function saveSaleFromOrder(
  createdId,
  montoTotal,
  descuento,
  descuentoCalculado,
  montoFacturar,
  idUsuarioCrea,
  idCliente,
  idPedido,
  products,
  fechaHora
) {
  console.log("Creando venta");
  return new Promise((resolve, reject) => {
    const objVenta = {
      pedido: {
        idUsuarioCrea: idUsuarioCrea,
        idCliente: idCliente,
        fechaCrea: dateString(),
        fechaActualizacion: dateString(),
        montoTotal: montoTotal.toFixed(2),
        descCalculado: descuentoCalculado.toFixed(2),
        descuento: descuento,
        montoFacturar: montoFacturar.toFixed(2),
        idPedido: idPedido,
        idFactura: createdId,
      },
      productos: products,
    };
    const ventaCreada = createSale(objVenta);
    ventaCreada
      .then((res) => {
        console.log("Venta creada", res);
        const updated = updateInvoicedOrder(idPedido, dateString());
        updated.then((upd) => {
          console.log("Estado del pedido actualizado", upd);
          resolve(true);
        });
      })
      .catch((err) => {
        console.log("Error al crear la venta", err);
        const deletedInvoice = deleteInvoice(createdId);
        reject(false);
        console.log("Venta y factura borradas", deletedInvoice);
      });
  });
}

export { createInvoice, deleteInvoice, saveInvoice };
