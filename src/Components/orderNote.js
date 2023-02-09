import React from "react";
import { Table } from "react-bootstrap";
import { dateString } from "../services/dateServices";
export const OrderNote = React.forwardRef(({ productList }, ref) => {
  return (
    <div ref={ref} className="invoicePage">
      {productList.map((pl, index) => {
        return (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            <div className="invoiceTittle">Incadex S.R.L</div>
            <div className="simpleSeparator"></div>
            <div>NOTA DE ORDEN</div>
            {pl.rePrint ? <div>REIMPRESION</div> : null}
            <div className="simpleSeparator"></div>
            <div className="textWithLine"></div>
            <div className="simpleSeparator"></div>
            <div className="invoiceStart">
              <div>{`Fecha de Solicitud: ${pl.fechaSolicitud}`}</div>
              <div>{`Fecha de Impresión: ${dateString()}`}</div>
              <div>{`Id Pedido: ${pl.id}`}</div>
              <div>{`Usuario solicitante: ${pl.usuario}`}</div>
            </div>
            <div className="simpleSeparator"></div>
            <div className="textWithLine"></div>
            <div className="simpleSeparator"></div>
            <div>Productos</div>
            <Table className="noteTable">
              <thead>
                <tr className="invoiceProduct">
                  <th>Cod Interno</th>
                  <th>Producto</th>
                  <th>Cant</th>
                  <th>Listo</th>
                </tr>
              </thead>
              <tbody>
                {pl.productos.map((pr, index) => {
                  return (
                    <tr key={index}>
                      <td className="invoiceProduct">{pr.codInterno}</td>
                      <td className="invoiceProduct">{pr.nombreProducto}</td>
                      <td className="invoiceProduct">{pr.cantidadProducto}</td>
                      <td>
                        <div className="tickBox"></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td>Total</td>
                  <td>
                    {pl.productos.reduce((accumulator, object) => {
                      return accumulator + object.cantidadProducto;
                    }, 0)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
            <div className="centerContainer">
              {" "}
              <div className="ready">Pedido Listo</div>
            </div>
            <div className="centerContainer">
              <div className="signatureLine">Firma</div>
            </div>
            <div className="simpleSeparator"></div>
            <div className="simpleSeparator">---------------</div>
          </div>
        );
      })}
    </div>
  );
});
