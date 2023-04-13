import React from "react";

import { QRCodeCanvas } from "qrcode.react";
export default function QrComponent({ datos, size }) {
  return (
    <QRCodeCanvas
      id="invoiceQr"
      value={datos}
      size={170}
      bgColor="#FFF"
      fgColor="#000"
      includeMargin
      level={"H"}
    />
  );
}
