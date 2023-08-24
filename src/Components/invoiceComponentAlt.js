import React from "react";
import "../styles/invoiceStyles.css";
import QrComponent from "./qrComponent";
import { convertToText } from "../services/numberServices";
import { dateString } from "../services/dateServices";
export const InvoiceComponentAlt = React.forwardRef(
  (
    {
      branchInfo,
      selectedProducts,
      cuf,
      invoice,
      paymentData,
      totalsData,
      isOrder,
      invoiceNumber,
      orderDetails,
      leyenda,
      urlSin,
      offlineText,
    },
    ref
  ) => {
    const convertido = convertToText(totalsData?.totalDescontado);
    const splittedDate = isOrder
      ? paymentData.fechaHora.split(" ")
      : dateString().split(" ");
    const date = splittedDate[0];
    const time = splittedDate[1].substring(0, 5);
    console.log("Payment data", paymentData);
    function formattedCuf(cuf) {
      const regex = new RegExp(".{1,30}", "g");
      const result = cuf.match(regex).join(" ");
      return result;
    }
    const inum = invoiceNumber;
    return (
      <div>
        <div ref={ref} className="invoicePage">
          <div className="invoiceTittle">Incadex S.R.L</div>

          <div>{`${branchInfo?.nombre}`}</div>
          <div className="simpleSeparator"></div>
          <div>{`${branchInfo?.dir}`}</div>
          <div>{`Telefono ${branchInfo?.tel}`}</div>
          <div> {`${branchInfo?.ciudad} - Bolivia`}</div>
          <div> {`Sucursal No ${branchInfo?.nro}`}</div>
          <div className="simpleSeparator"></div>
          <div>FACTURA</div>
          <div className="simpleSeparator"></div>
          <div>ORIGINAL</div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div>{`NIT ${process.env.REACT_APP_NIT_EMPRESA}`}</div>
          <div>{`FACTURA Nº ${inum}`}</div>
          <div className="cufWidth">{`CUF: ${formattedCuf(cuf)}`}</div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div>{`Elaboración de otros productos alimenticios (Tostado, torrado, molienda de cafe, elab. De Té, mates, miel artificial, chocolates. etc.)`}</div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div className="leftText">{`Fecha:  ${date}   Hora:  ${time}`}</div>
          <div className="leftText">{`Señor(es):  ${invoice?.razonSocial}`}</div>
          <div className="leftText">{`NIT/CI: ${invoice?.nitCliente}`}</div>
          <div className="simpleSeparator"></div>
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
                  const totalProducto =
                    producto.total != undefined
                      ? producto.total
                      : producto.totalProd;
                  return (
                    <tr key={index}>
                      <td className="xsmallProductLeft">
                        {producto?.cantProducto}
                      </td>
                      <td className="largeProduct">
                        {producto?.nombreProducto}
                      </td>
                      <td className="smallProductLeft">
                        {" "}
                        {producto?.precioDeFabrica}
                      </td>
                      <td className="smallProductLeft">
                        {parseFloat(producto.descuentoProd)?.toFixed(2)}
                      </td>
                      <td className="ProductLeft">
                        {parseFloat(totalProducto)?.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div>
            <table className="tablaTotales">
              <tbody>
                <tr>
                  <td className="totals">Total</td>
                  <td className="totalsData">{`${parseFloat(
                    totalsData?.total
                  ).toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td className="totals">Descuento</td>
                  <td className="totalsData">{`${parseFloat(
                    totalsData?.descuentoCalculado
                  ).toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td className="totals">TOTAL FACT</td>
                  <td className="totalsData">{`${parseFloat(
                    totalsData?.totalDescontado
                  ).toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="simpleSeparator"></div>
          <div className="leftText">{`Son: ${convertido?.texto.toUpperCase()} CON ${
            convertido.resto
          }/100`}</div>
          <div className="leftText">{`Bolivianos`}</div>
          <div className="simpleSeparator"></div>
          <div>
            <table className="tablaTotales">
              <tbody>
                <tr>
                  <td className="totals">{`RECIBIDOS ${paymentData?.tipoPago} Bs.`}</td>
                  <td className="totalsData">{`${parseFloat(
                    paymentData?.cancelado
                  ).toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td className="totals">
                    {paymentData?.cambio == "Efectivo-tarjeta"
                      ? `Tarjeta `
                      : `Cambio `}
                  </td>
                  <td className="totalsData">{`${parseFloat(
                    paymentData?.cambio
                  ).toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <QrComponent
              datos={
                urlSin
                  ? urlSin
                  : `https://siat.impuestos.gob.bo/consulta/QR?nit=${process.env.REACT_APP_NIT_EMPRESA}&cuf=${cuf}&numero=${inum}`
              }
              size={170}
            />
          </div>
          <div>{`"Esta factura contribuye al desarrollo del pais. El uso ilícito de esta será sancionado acuerdo a la ley"`}</div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div>{offlineText ? offlineText : ""}</div>
          <div className="simpleSeparator"></div>
          <div> {leyenda}</div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div>¡GRACIAS POR SU COMPRA!</div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          {orderDetails != undefined ? (
            <div>
              <div className="simpleSeparator">{`Código del pedido:${orderDetails.idString}`}</div>
              <div className="simpleSeparator">{`Notas del pedido:${orderDetails.notas}`}</div>
            </div>
          ) : null}
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
        </div>
      </div>
    );
  }
);

/*  */
