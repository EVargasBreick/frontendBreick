import React from "react";
import "../styles/invoiceStyles.css";
import QrComponent from "./qrComponent";
import { convertToText } from "../services/numberServices";
import { dateString } from "../services/dateServices";

export const DropComponent = React.forwardRef(
  (
    { branchInfo, selectedProducts, cliente, dropId, total, vale, motivo },
    ref
  ) => {
    console.log("Selectedproducts", selectedProducts);
    const splittedDate = dateString().split(" ");
    const date = splittedDate[0];
    const time = splittedDate[1].substring(0, 5);
    return (
      <div ref={ref} className="invoicePage">
        <div style={{ pageBreakAfter: "always" }}>
          <div className="invoiceTittle">Incadex S.R.L</div>
          <div>{`${branchInfo?.nombre}`}</div>
          <div className="simpleSeparator"></div>
          <div>{`${branchInfo?.dir}`}</div>
          <div>{`Telefono ${branchInfo?.tel}`}</div>
          <div> {`${branchInfo?.ciudad} - Bolivia`}</div>
          <div> {`Sucursal No ${branchInfo?.nro}`}</div>
          <div className="simpleSeparator"></div>
          <div>{`NOTA DE ENTREGA/BAJA ${dropId}`}</div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div>{`MOTIVO:`}</div>
          <div>{motivo}</div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="leftText">{`Fecha:  ${date}   Hora:  ${time}`}</div>
          <div className="leftText">{`Señor(es):  ${cliente?.razonSocial}`}</div>
          <div className="leftText">{`NIT/CI: ${cliente?.nit}`}</div>
          {vale ? (
            <div className="leftText">{`NIT/CI: ${cliente?.nit}`}</div>
          ) : null}

          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div>
            <table>
              <thead>
                <tr>
                  <th className="largeProduct">Detalle</th>
                  <th className="xsmallProductLeft">Cantidad</th>
                  <th className="xsmallProductLeft">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto, index) => {
                  return (
                    <tr key={index}>
                      <td className="rowSeparator">
                        {producto?.nombreProducto}
                      </td>
                      <td className="rowSeparatorAlt">
                        {producto?.cantProducto}
                      </td>
                      <td className="rowSeparatorAlt">{producto?.total}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Total:</th>
                  <th>{total.toFixed(2)}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div>Compartir es delicioso</div>
          <div className="simpleSeparator"></div>
        </div>
        {/* <div style={{ pageBreakAfter: "always" }}>
          <div className="simpleSeparator"></div>
          <div className="invoiceTittle">Incadex S.R.L</div>
          <div>{`${branchInfo?.nombre}`}</div>
          <div className="simpleSeparator"></div>
          <div>{`${branchInfo?.dir}`}</div>
          <div>{`Telefono ${branchInfo?.tel}`}</div>
          <div> {`${branchInfo?.ciudad} - Bolivia`}</div>
          <div> {`Sucursal No ${branchInfo?.nro}`}</div>
          <div className="simpleSeparator"></div>
          <div>{`NOTA DE ENTREGA ${dropId}`}</div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="leftText">{`Fecha:  ${date}   Hora:  ${time}`}</div>
          <div className="leftText">{`Señor(es):  ${cliente?.razonSocial}`}</div>
          <div className="leftText">{`NIT/CI: ${cliente?.nit}`}</div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div>
            <table>
              <thead>
                <tr>
                  <th className="largeProduct">Detalle</th>
                  <th className="xsmallProductLeft">Cantidad</th>
                  <th className="xsmallProductLeft">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto, index) => {
                  return (
                    <tr key={index}>
                      <td className="rowSeparator">
                        {producto?.nombreProducto}
                      </td>
                      <td className="rowSeparatorAlt">
                        {producto?.cantProducto}
                      </td>
                      <td className="rowSeparatorAlt">{producto?.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div></div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
          <div className="textWithLine"></div>
          <div className="simpleSeparator"></div>
          <div>Compartir es delicioso</div>
          <div className="simpleSeparator"></div>
          <div className="simpleSeparator"></div>
              </div>*/}
      </div>
    );
  }
);
