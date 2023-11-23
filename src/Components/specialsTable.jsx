import React from "react";
import { Table } from "react-bootstrap";

export default function SpecialsTable({
  especiales,
  totales,
  isEsp,
  isSeasonalEsp,
}) {
  //console.log("Especiales", especiales);
  const isEspe =
    isSeasonalEsp && especiales.length > 0
      ? true
      : totales?.descCalculadoEspeciales?.toFixed(2) > 0 || isEsp
      ? true
      : false;

  return (
    <div>
      {isEspe ? (
        <div>
          <div className="specialDiscountHeader">
            Detalle de productos con descuento fijo
          </div>
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio Especial</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {especiales.map((esp, index) => {
                return (
                  <tr key={index}>
                    <td>{esp.nombreProducto}</td>
                    <td>{`${esp.precioDescuentoFijo.toFixed(2)} Bs.`}</td>
                    <td>{esp.cantProducto}</td>
                    <td>{`${(
                      esp.precioDescuentoFijo * esp.cantProducto
                    ).toFixed(2)} Bs.`}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <th>Totales</th>
                <td>
                  {especiales.reduce((accumulator, object) => {
                    return accumulator + parseFloat(object.cantProducto);
                  }, 0)}
                </td>
                <td>
                  {`${especiales
                    .reduce((accumulator, object) => {
                      return (
                        accumulator +
                        parseFloat(object.precioDescuentoFijo) *
                          parseFloat(object.cantProducto)
                      );
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
