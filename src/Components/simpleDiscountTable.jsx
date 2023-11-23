import React from "react";
import { Table } from "react-bootstrap";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";

export default function SimpleDiscountTable({ totales }) {
  return (
    <Table bordered className="modalBody">
      <thead className="tableModalHeader">
        <tr>
          <th></th>
          <th>{`Total Neto`}</th>
          <th>Descuento</th>
          <th>Descuento Calculado</th>
          <th>Total a facturar</th>
        </tr>
      </thead>
      <tbody className="modalTable">
        <tr>
          <td>Productos con descuento porcentual</td>
          <td>{`${totales.totalDescontables} Bs.`}</td>
          <td>{`${totales.descuento} %`}</td>
          <td>{`${parseFloat(totales.descCalculado)?.toFixed(2)} Bs.`}</td>
          <td>{`${parseFloat(
            totales.totalDescontables - totales.descCalculado
          )?.toFixed(2)} Bs.`}</td>
        </tr>
        <tr>
          <td>Productos sin descuento</td>
          <td>{`${totales.totalEspecial} Bs.`}</td>
          <td>{`0`}</td>
          <td>{`0 Bs.`}</td>
          <td>{`${totales.totalEspecial} Bs.`}</td>
        </tr>
      </tbody>
      <tfoot className="tableModalHeader">
        <tr>
          <th>Totales</th>
          <td>{` ${totales.totalEspecial + totales.totalDescontables} Bs.`}</td>
          <td>{`-`}</td>
          <td>
            {`${(
              parseFloat(totales.descCalculado) +
              parseFloat(totales.descCalculadoEspeciales)
            ).toFixed(2)}`}
          </td>
          <td>
            {`${parseFloat(totales.totalTradicional + totales.facturar).toFixed(
              2
            )} Bs.`}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}
