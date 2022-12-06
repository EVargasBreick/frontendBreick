import React from "react";

import { QRCodeCanvas } from "qrcode.react";
export default function QrComponent(datos) {
  return (
    <QRCodeCanvas
      id="invoiceQr"
      value="123"
      size={144}
      bgColor="#FFF"
      fgColor="#000"
      includeMargin
      level={"H"}
      hidden
    />
  );
}
