import React from "react";

import { QRCodeCanvas } from "qrcode.react";
export default function QrComponent({ datos, size }) {
  console.log("Datos para el qr", datos);
  return (
    <QRCodeCanvas
      id="invoiceQr"
      value={datos}
      size={size}
      bgColor="#FFF"
      fgColor="#000"
      includeMargin
      level={"H"}
    />
  );
}
