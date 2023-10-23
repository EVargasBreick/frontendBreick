import React from "react";
import "../styles/invoiceStyles.css";
import { dateString } from "../services/dateServices";

export const PackageDropComponent = React.forwardRef(
  ({ branchInfo, selectedProducts, cliente, packName, cantPack }, ref) => {
    //console.log("Selectedproducts", selectedProducts);
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
          <div>{`PACK ARMADO ${packName}`}</div>
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
                  <th className="xsmallProductLeft">Codigo</th>
                  <th className="largeProduct">Detalle</th>
                  <th className="xsmallProductLeft">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto, index) => {
                  return (
                    <tr key={index}>
                      <td className="rowSeparatorAlt">
                        {producto?.idProducto}
                      </td>

                      <td className="rowSeparator">
                        {producto?.nombreProducto}
                      </td>
                      <td className="rowSeparatorAlt">
                        {Number(producto?.cantProducto) * Number(cantPack)}
                      </td>
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
        </div>
      </div>
    );
  }
);
