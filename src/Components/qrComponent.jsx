import React from "react";

import { QRCodeCanvas } from "qrcode.react";
export default function QrComponent({ datos }) {
  console.log("Datos para el qr", datos);
  return (
    <QRCodeCanvas
      id="invoiceQr"
      value={datos}
      size={100}
      bgColor="#FFF"
      fgColor="#000"
      includeMargin
      level={"H"}
    />
  );
}
