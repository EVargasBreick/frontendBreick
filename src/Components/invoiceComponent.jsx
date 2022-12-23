import React from "react";
import "../styles/invoiceStyles.css";
import QrComponent from "./qrComponent";
import { convertToText } from "../services/numberServices";
import { dateString } from "../services/dateServices";
export const InvoiceComponent = React.forwardRef(
  (
    { branchInfo, selectedProducts, cuf, invoice, paymentData, totalsData },
    ref
  ) => {
    const convertido = convertToText(totalsData.totalDescontado);
    const splittedDate = dateString().split(" ");
    const date = splittedDate[0];
    const time = splittedDate[1].substring(0, 5);
    return (
      <div ref={ref} className="invoicePage">
        <div className="invoiceTittle">Incadex S.R.L</div>
        <div>{`${branchInfo.nombre}`}</div>
        <div className="simpleSeparator"></div>
        <div>{`${branchInfo.dir}`}</div>
        <div>{`Telefono ${branchInfo.tel}`}</div>
        <div> {`${branchInfo.ciudad} - Bolivia`}</div>
        <div> {`Sucursal No ${branchInfo.nro}`}</div>
        <div className="simpleSeparator"></div>
        <div>FACTURA</div>
        <div className="textWithLine">ORIGINAL</div>
        <div className="simpleSeparator"></div>
        <div>{`NIT ${invoice.nitEmpresa}`}</div>
        <div>{`FACTURA Nº ${invoice.nroFactura}`}</div>
        <div>{`CUF: ${cuf}`}</div>
        <div className="simpleSeparator"></div>
        <div className="textWithLine"></div>
        <div className="simpleSeparator"></div>
        <div>{`ELABORACIÓN DE OTROS PRODUCTOS ALIMENTICIOS (TOSTADO, TORRADO, MOLIENDA DE CAFÉ, ELAB. DE TÉ, MATES, MIEL ARTIFICIAL, CHOCOLATES, ETC.)`}</div>
        <div className="textWithLine"></div>
        <div className="simpleSeparator"></div>
        <div className="leftText">{`Fecha:  ${date}   Hora:  ${time}`}</div>
        <div className="leftText">{`Señor(es)  ${invoice.razonSocial}`}</div>
        <div className="leftText">{`NIT/CI: ${invoice.nitCliente}`}</div>
        <div className="textWithLine"></div>
        <div>
          <table>
            <thead>
              <tr>
                <td className="xsmallProductLeft">Cant</td>
                <td className="largeProduct">Detalle</td>
                <td className="smallProductLeft">Unit</td>
                <td className="smallProductLeft">Desc</td>
                <td className="ProductLeft">Sub Total</td>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((producto, index) => {
                return (
                  <tr key={index}>
                    <td className="xsmallProductLeft">
                      {producto.cantProducto}
                    </td>
                    <td className="largeProduct">{producto.nombreProducto}</td>
                    <td className="smallProductLeft">
                      {" "}
                      {producto.precioDeFabrica}
                    </td>
                    <td className="smallProductLeft">
                      {parseFloat(producto.descuentoProd).toFixed(2)}
                    </td>
                    <td className="ProductLeft">
                      {parseFloat(producto.total).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="textWithLine"></div>
        <div>
          <table className="tablaTotales">
            <tbody>
              <tr>
                <td className="totals">Total</td>
                <td className="totalsData">{`${parseFloat(
                  totalsData.total
                ).toFixed(2)}`}</td>
              </tr>
              <tr>
                <td className="totals">Descuento</td>
                <td className="totalsData">{`${parseFloat(
                  totalsData.descuentoCalculado
                ).toFixed(2)}`}</td>
              </tr>
              <tr>
                <td className="totals">TOTAL FACT</td>
                <td className="totalsData">{`${parseFloat(
                  totalsData.totalDescontado
                ).toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="simpleSeparator"></div>
        <div className="leftText">{`Son: ${convertido.texto.toUpperCase()} CON ${
          convertido.resto
        }/100`}</div>
        <div className="leftText">{`Bolivianos`}</div>
        <div className="simpleSeparator"></div>
        <div>
          <table className="tablaTotales">
            <tbody>
              <tr>
                <td className="totals">{`RECIBIDOS ${paymentData.tipoPago} Bs.`}</td>
                <td className="totalsData">{`${paymentData.cancelado}`}</td>
              </tr>
              <tr>
                <td className="totals">Cambio</td>
                <td className="totalsData">{`${paymentData.cambio}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <QrComponent
            datos={JSON.stringify(
              invoice.nitEmpresa +
                "|" +
                invoice.nroFactura +
                "|" +
                invoice.cuf +
                "|" +
                date +
                "|" +
                totalsData.total +
                "|" +
                totalsData.totalDescontado +
                "|" +
                totalsData.descuentoCalculado +
                "|" +
                invoice.nitCliente
            )}
          />
        </div>
        <div>{`"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA SERA SANCIONADO DE ACUERDO A LA LEY"`}</div>
        <div className="simpleSeparator"></div>
        <div>
          {" "}
          {`Ley Nº 453: El proveedor debe brindar atención sin discriminación, con respeto, calidez y cordialidad a los usuarios`}
        </div>
        <div className="simpleSeparator"></div>
        <div className="textWithLine"></div>
        <div className="simpleSeparator"></div>
        <div>¡GRACIAS POR SU COMPRA!</div>
        <div className="simpleSeparator"></div>
        <div className="textWithLine"></div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div className="simpleSeparator"></div>
        <div className="textWithLine"></div>
      </div>
    );
  }
);
