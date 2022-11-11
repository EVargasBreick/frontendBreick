import React from "react";
import { Modal } from "react-bootstrap";

export default function SaleModal(datos) {
  return (
    <div>
      <QrComponent className="hiddenQr" datos={datos} />
      <Modal>
        <Modal.Header closeButton>
          <Modal.Title>CONFIRMAR VENTA</Modal.Title>
        </Modal.Header>
        <Modal.Body>{"Imprimir Factura?"}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Imprimir Factura
          </Button>
        </Modal.Footer>
      </Modal>
      <PDFDownloadLink
        fileName={`fileName`}
        document={<InvoicePDF datos={datos} />}
      >
        Click Me
      </PDFDownloadLink>
    </div>
  );
}
