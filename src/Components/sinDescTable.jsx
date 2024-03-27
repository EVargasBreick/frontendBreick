import React from "react";
import { Table } from "react-bootstrap";

export default function SinDescTable({ sindDesc }) {
  console.log("Sin desc", sindDesc);
  const isEspe = sindDesc != undefined;
  return (
    <div>
      {isEspe ? (
        <div>
          <div className="specialDiscountHeader">
            Detalle de productos sin descuento
          </div>
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sindDesc.map((esp, index) => {
                //console.log("Sin desc", esp);
                return (
                  <tr key={index}>
                    <td>{esp.nombreProducto}</td>
                    <td>{`${Number(esp?.precioDeFabrica).toFixed(2)} Bs.`}</td>
                    <td>{esp.cantProducto}</td>
                    <td>{`${(esp?.precioDeFabrica * esp?.cantProducto).toFixed(
                      2
                    )} Bs.`}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <th>Totales</th>
                <td>
                  {sindDesc.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.cantProducto);
                  }, 0)}
                </td>
                <td>
                  {`${sindDesc
                    .reduce((accumulator, object) => {
                      return accumulator + parseFloat(object.totalProd);
                    }, 0)
                    .toFixed(2)} Bs.`}
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
