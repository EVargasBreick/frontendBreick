import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "../styles/formLayouts.css";
import "../styles/dynamicElements.css";
import "../styles/generalStyle.css";

export default function ComplexDiscountTable({
  tradicionales,
  pascua,
  navidad,
  halloween,
  sinDesc,
  tradObject,
  pasObject,
  navObject,
  hallObject,
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    console.log("Tradicionales", tradicionales);
    console.log("Sin descuento", sinDesc);
    function handleResize() {
      if (window.innerWidth < 700) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize(); // set the initial state on mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Table className="modalBodyAlt">
      <thead className="tableModalHeader">
        <tr>
          <th></th>
          <th>Total</th>
          <th>{isMobile ? `Des cuento %` : `Descuento %`}</th>
          <th>{isMobile ? `Desc Calculado` : `Descuento Calculado`}</th>
          <th>{isMobile ? `Facturar` : `Total Facturar`}</th>
        </tr>
      </thead>
      <tbody className="modalTable">
        <tr>
          {tradicionales.length > 0 || sinDesc.length > 0 ? (
            <td>Tradicionales</td>
          ) : null}
          {tradicionales.length > 0 || sinDesc.length > 0 ? (
            <td>{tradObject.total + " Bs."}</td>
          ) : null}
          {tradicionales.length > 0 || sinDesc.length > 0 ? (
            <td>{`${tradObject.descuento} %`}</td>
          ) : null}
          {tradicionales.length > 0 || sinDesc.length > 0 ? (
            <td>{tradObject.descCalculado + " Bs."}</td>
          ) : null}
          {tradicionales.length > 0 || sinDesc.length > 0 ? (
            <td>{tradObject.facturar + " Bs."}</td>
          ) : null}
        </tr>
        <tr>
          {pascua.length > 0 ? <td>Pascua</td> : null}
          {pascua.length > 0 ? <td>{pasObject.total + " Bs."}</td> : null}
          {pascua.length > 0 ? <td>{`${pasObject.descuento} %`}</td> : null}
          {pascua.length > 0 ? (
            <td>{pasObject.descCalculado + " Bs."}</td>
          ) : null}
          {pascua.length > 0 ? <td>{pasObject.facturar + " Bs."}</td> : null}
        </tr>
        <tr>
          {navidad.length > 0 ? <td>Navidad</td> : null}
          {navidad.length > 0 ? <td>{navObject.total + " Bs."}</td> : null}
          {navidad.length > 0 ? <td>{`${navObject.descuento} %`}</td> : null}
          {navidad.length > 0 ? (
            <td>{navObject.descCalculado + " Bs."}</td>
          ) : null}

          {navidad.length > 0 ? <td>{navObject.facturar + " Bs."}</td> : null}
        </tr>
        <tr>
          {halloween.length > 0 ? <td>Halloween</td> : null}
          {halloween.length > 0 ? <td>{hallObject.total + " Bs."}</td> : null}
          {halloween.length > 0 ? <td>{`${hallObject.descuento} %`}</td> : null}
          {halloween.length > 0 ? (
            <td>{hallObject.descCalculado + " Bs."}</td>
          ) : null}
          {halloween.length > 0 ? (
            <td>{hallObject.facturar + " Bs."}</td>
          ) : null}
        </tr>
      </tbody>
      <tfoot className="tableModalHeader">
        <tr>
          <th>Totales</th>
          <td>
            {tradObject.total +
              pasObject.total +
              navObject.total +
              hallObject.total +
              " Bs."}
          </td>
          <td>{`-`}</td>
          <td>
            {(
              parseFloat(pasObject.descCalculado) +
              parseFloat(tradObject.descCalculado) +
              parseFloat(navObject.descCalculado) +
              parseFloat(hallObject.descCalculado)
            ).toFixed(2) + " Bs."}
          </td>
          <td>
            {`${(
              parseFloat(tradObject.facturar) +
              parseFloat(pasObject.facturar) +
              parseFloat(navObject.facturar) +
              parseFloat(hallObject.facturar)
            ).toFixed(2)} Bs.`}
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}
