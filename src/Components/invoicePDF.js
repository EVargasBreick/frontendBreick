import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import "../styles/pdfStyles.css";
import { convertToText } from "../services/numberServices";
import QrComponent from "./qrComponent";
import { dateString } from "../services/dateServices";
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    width: "79mm",
  },
  section: {
    flexGrow: 1,
  },
  tittle: {
    paddingTop: "15%",
    textAlign: "center",
    fontSize: 9,
  },
  bodyText: {
    textAlign: "center",
    fontSize: 7,
  },
  bodyTextSep: {
    paddingTop: "5%",
    textAlign: "center",
    textAlign: "center",
    fontSize: 7,
  },
  bodyTextSepCent: {
    paddingTop: "5%",
    textAlign: "center",
    textAlign: "center",
    fontSize: 7,
  },
  bodyTextSepCentEnd: {
    paddingTop: "5%",
    textAlign: "center",
    textAlign: "center",
    fontSize: 7,
    paddingBottom: "10%",
  },
  bodyTextBold: {
    textAlign: "center",
    fontSize: 7,
  },
  bodyTextBoldSep: {
    paddingTop: "5%",
    textAlign: "center",
    fontSize: 7,
  },
  bodyTextBoldBottom: {
    textAlign: "center",
    fontSize: 7,
    borderColor: "black",
    borderBottomWidth: "0.5",
  },
  bodyTextBottomSep: {
    textAlign: "center",
    fontSize: 7,
    borderColor: "black",
    borderBottomWidth: "0.5",
    paddingBottom: "5%",
  },
  leftTextTop: {
    fontSize: 7,
    paddingTop: "5%",
  },
  rightTextTop: {
    fontSize: 7,
    paddingTop: "5%",
  },
  leftTextTopMar: {
    fontSize: 7,
    paddingTop: "5%",

    borderColor: "black",
    borderTopWidth: "0.5",
  },

  leftText: {
    fontSize: 7,
    paddingLeft: "2%",
  },
  rightText: {
    fontSize: 7,
    paddingRight: "2%",
  },
  leftTextBottom: {
    fontSize: 7,
    borderColor: "black",
    borderBottomWidth: "0.5",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingBottom: "2%",
  },
  total: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",

    borderTopWidth: "0.5",
    borderColor: "black",
  },
  totalRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  tableHeaderM: {
    fontSize: 7,
    width: "20%",
    paddingTop: "5%",
    paddingBottom: "5%",
    textAlign: "center",
  },
  tableHeaderL: {
    fontSize: 7,
    width: "60%",
    paddingTop: "5%",
    paddingBottom: "5%",
  },
  tableTextM: {
    fontSize: 7,
    width: "20%",
    paddingTop: "1%",
    textAlign: "right",
  },
  tableTextL: {
    fontSize: 7,
    width: "60%",
    paddingTop: "1%",
  },
  qrImage: {
    width: "25%",
  },
  qrContainer: {
    alignItems: "center",
    paddingTop: "5%",
  },
  endTag: {
    borderTopWidth: "0.5",
    borderBottomWidth: "0.5",
    borderColor: "black",
    paddingTop: "2%",
    paddingBottom: "2%",
  },
});

// Create Document Component
export default function InvoicePDF({
  branchInfo,
  selectedProducts,
  cuf,
  invoice,
  paymentData,
  totalsData,
}) {
  const dataUrl = document.getElementById("invoiceQr").toDataURL();
  const convertido = convertToText(totalsData.totalDescontado);
  const splittedDate = dateString().split(" ");
  const date = splittedDate[0];
  const time = splittedDate[1].substring(0, 5);
  return (
    <Document>
      <Page style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Text style={styles.tittle}>Incadex S R L </Text>
          <Text style={styles.bodyText}>{`${branchInfo.nombre}`} </Text>
          <Text style={styles.bodyTextSep}>{`${branchInfo.dir}`} </Text>
          <Text style={styles.bodyText}>{`Telefono ${branchInfo.tel}`} </Text>
          <Text style={styles.bodyText}>
            {`${branchInfo.ciudad} - Bolivia`}{" "}
          </Text>
          <Text style={styles.bodyTextBold}>
            {`Sucursal No ${branchInfo.nro}`}
          </Text>
          <Text style={styles.bodyTextBoldSep}>FACTURA</Text>
          <Text style={styles.bodyTextBoldBottom}>{`ORIGINAL`}</Text>
          <Text style={styles.bodyTextSep}>{`NIT ${invoice.nitEmpresa}`} </Text>
          <Text
            style={styles.bodyText}
          >{`FACTURA Nº ${invoice.nroFactura}`}</Text>
          <Text style={styles.bodyTextBottomSep}>{`CUF: ${cuf}`}</Text>
          <Text style={styles.bodyText}>
            {`ELABORACIÓN DE OTROS PRODUCTOS ALIMENTICIOS (TOSTADO, TORRADO, MOLIENDA DE CAFÉ, ELAB. DE TÉ, MATES, MIEL ARTIFICIAL, CHOCOLATES, ETC.)`}
          </Text>
          <Text
            style={styles.leftTextTop}
          >{`Fecha:  ${date}   Hora:  ${time}`}</Text>
          <Text
            style={styles.leftText}
          >{`Señor(es)  ${invoice.razonSocial}`}</Text>
          <Text
            style={styles.leftTextBottom}
          >{`NIT/CI: ${invoice.nitCliente}`}</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeaderM}>Cant</Text>
            <Text style={styles.tableHeaderL}>Detalle</Text>
            <Text style={styles.tableHeaderM}>Unit</Text>
            <Text style={styles.tableHeaderM}>Sub Total</Text>
          </View>
          {selectedProducts.map((producto, index) => {
            return (
              <View style={styles.table} key={index}>
                <Text style={styles.tableTextM}>{producto.cantProducto}</Text>
                <Text style={styles.tableTextL}>{producto.nombreProducto}</Text>
                <Text style={styles.tableTextM}>
                  {producto.precioDeFabrica}
                </Text>
                <Text style={styles.tableTextM}>{producto.total}</Text>
              </View>
            );
          })}

          <View style={styles.total}>
            <Text style={styles.leftTextTop}>{`TOTAL`}</Text>
            <Text style={styles.rightTextTop}>{`${totalsData.total}`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.leftTextTop}>{`DESCUENTO`}</Text>
            <Text
              style={styles.rightTextTop}
            >{`${totalsData.descuentoCalculado}`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.leftText}>{`TOTAL FACT`}</Text>
            <Text
              style={styles.rightText}
            >{`${totalsData.totalDescontado}`}</Text>
          </View>
          <Text
            style={styles.leftTextTop}
          >{`Son: ${convertido.texto.toUpperCase()} CON ${
            convertido.resto
          }/100`}</Text>
          <Text style={styles.leftText}>{`Bolivianos`}</Text>
          <View style={styles.totalRow}>
            <Text
              style={styles.leftTextTop}
            >{`RECIBIDOS ${paymentData.tipoPago} Bs.`}</Text>
            <Text
              style={styles.rightTextTop}
            >{`${paymentData.cancelado}`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.leftText}>{`Cambio`}</Text>
            <Text style={styles.rightText}>{`${paymentData.cambio}`}</Text>
          </View>
          <View style={styles.qrContainer}>
            <Image allowDangerousPaths src={dataUrl} style={styles.qrImage} />
          </View>
          <Text style={styles.bodyTextSepCent}>
            {`"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA SERA SANCIONADO DE ACUERDO A LA LEY"`}{" "}
          </Text>
          <Text style={styles.bodyTextSepCentEnd}>
            {`Ley Nº 453: El proveedor debe brindar atención sin discriminación, con respeto, calidez y cordialidad a los usuarios`}{" "}
          </Text>
          <View style={styles.endTag}>
            <Text style={styles.bodyTextSepCent}>GRACIAS POR SU COMPRA</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
