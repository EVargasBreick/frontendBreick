import React from "react";

import { QRCodeCanvas } from "qrcode.react";
export default function QrComponent(datos) {
  return (
    <QRCodeCanvas
      id="invoiceQr"
      value={JSON.stringify(datos.datos)}
      size={144}
      bgColor="#FFF"
      fgColor="#000"
      includeMargin
      level={"H"}
      hidden
    />
  );
}
