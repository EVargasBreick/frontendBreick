import axios from "axios";

import { dateString } from "./dateServices";
import { updateInvoicedOrder } from "./orderServices";

import { createSale } from "./saleServices";

const createInvoice = (invoiceObject) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/factura`,
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
      .delete(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/factura?id=${id}`
      )
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
      desembolsada: desembolsada,
    };
    const newInvoice = createInvoice(invoiceBody);
    newInvoice
      .then((res) => {
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
        const updated = updateInvoicedOrder(idPedido, dateString());
        updated.then((upd) => {
          resolve(true);
        });
      })
      .catch((err) => {
        console.log("Error al crear la venta", err);
        const deletedInvoice = deleteInvoice(createdId);
        reject(false);
      });
  });
}

function getStoreInvoices(id, pdv) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/facturas/lista?idSucursal='${id}'&pdv=${pdv}`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function cancelInvoiceUpdate(id) {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/facturas/anular?id='${id}'`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function otherPaymentsList() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT_URL}${process.env.REACT_APP_ENDPOINT_PORT}/pagos/otros`
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export {
  createInvoice,
  deleteInvoice,
  saveInvoice,
  getStoreInvoices,
  cancelInvoiceUpdate,
  otherPaymentsList,
};
