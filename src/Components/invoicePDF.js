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
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
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
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  bodyTextSepCentEnd: {
    paddingTop: "5%",
    textAlign: "center",
    textAlign: "center",
    fontSize: 7,
    paddingLeft: "10%",
    paddingRight: "10%",
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
    paddingLeft: "2%",
  },
  rightTextTop: {
    fontSize: 7,
    paddingTop: "5%",
    paddingRight: "2%",
  },
  leftTextTopMar: {
    fontSize: 7,
    paddingTop: "5%",
    paddingLeft: "2%",
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
    paddingLeft: "2%",
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
    paddingRight: "10%",
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
export default function InvoicePDF(datos) {
  const dataUrl = document.getElementById("invoiceQr").toDataURL();
  const convertido = convertToText(2.3);
  const productos = [
    {
      cantidad: 1,
      detalle: "Producto 1",
      precio: 1,
      total: 1,
    },
    {
      cantidad: 2,
      detalle: "Producto 2",
      precio: 3,
      total: 6,
    },
    {
      cantidad: 2,
      detalle: "Producto 2",
      precio: 3,
      total: 6,
    },
  ];
  console.log("Datos en pdf", datos.datos);
  return (
    <Document>
      <Page style={styles.page} size="A7" wrap={false}>
        <View style={styles.section}>
          <Text style={styles.tittle}>Incadex S R L </Text>
          <Text style={styles.bodyText}>Ag San Miguel </Text>
          <Text style={styles.bodyText}>{datos.datos} </Text>
          <Text style={styles.bodyTextSep}>Calle 21 Nº8332 Calacoto </Text>
          <Text style={styles.bodyText}>Telefono 2771133 </Text>
          <Text style={styles.bodyText}>La Paz - Bolivia </Text>
          <Text style={styles.bodyTextBold}>Sucursal No 7 </Text>
          <Text style={styles.bodyTextBoldSep}>FACTURA</Text>
          <Text style={styles.bodyTextBoldBottom}>COPIA</Text>
          <Text style={styles.bodyTextSep}>NIT 128153028 </Text>
          <Text style={styles.bodyText}>FACTURA Nº 4496 </Text>
          <Text style={styles.bodyTextBottomSep}>
            AUTORIZACION Nº 114401200309824{" "}
          </Text>
          <Text style={styles.bodyTextBoldSep}>
            Elaboracion de Otros Productos
          </Text>
          <Text style={styles.bodyText}>
            {`Alimenticios (Tostado, Torrado, Molienda de`}
          </Text>
          <Text style={styles.bodyText}>
            {`Cafe, Elab de Te, Mates, Miel Artificial`}
          </Text>
          <Text style={styles.bodyText}>{`Chocolates, Etc.)`}</Text>
          <Text style={styles.bodyText}>
            {`Venta al por menor de otros productos`}
          </Text>
          <Text style={styles.bodyTextBoldBottom}>
            {`en almacenes no especializados`}
          </Text>
          <Text
            style={styles.leftTextTop}
          >{`Fecha:  13/09/2022   Hora:  14:26`}</Text>
          <Text style={styles.leftText}>{`Señor(es)  NOMBRE AQUI`}</Text>
          <Text style={styles.leftTextBottom}>{`NIT/CI: 00000000`}</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeaderM}>Cant</Text>
            <Text style={styles.tableHeaderL}>Detalle</Text>
            <Text style={styles.tableHeaderM}>Unit</Text>
            <Text style={styles.tableHeaderM}>Sub Total</Text>
          </View>
          {productos.map((producto, index) => {
            return (
              <View style={styles.table} key={index}>
                <Text style={styles.tableTextM}>{producto.cantidad}</Text>
                <Text style={styles.tableTextL}>{producto.detalle}</Text>
                <Text style={styles.tableTextM}>{producto.precio}</Text>
                <Text style={styles.tableTextM}>{producto.total}</Text>
              </View>
            );
          })}

          <View style={styles.total}>
            <Text style={styles.leftTextTop}>{`TOTAL`}</Text>
            <Text style={styles.rightTextTop}>{`2.30`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.leftTextTop}>{`DESCUENTO`}</Text>
            <Text style={styles.rightTextTop}>{`0`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.leftText}>{`TOTAL FACT`}</Text>
            <Text style={styles.rightText}>{`2.30`}</Text>
          </View>
          <Text
            style={styles.leftTextTop}
          >{`Son: ${convertido.texto.toUpperCase()} CON ${
            convertido.resto
          }/100`}</Text>
          <Text style={styles.leftText}>{`Bolivianos`}</Text>
          <View style={styles.totalRow}>
            <Text style={styles.leftTextTop}>{`RECIBIDOS EFECTIVO Bs.`}</Text>
            <Text style={styles.rightTextTop}>{`5.00`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.leftText}>{`Cambio`}</Text>
            <Text style={styles.rightText}>{`3.70`}</Text>
          </View>
          <Text style={styles.leftTextTop}>{`Cod Control 06-8F-6G-00`}</Text>
          <Text
            style={styles.leftText}
          >{`Fecha limite de emisión: 20/11/2022`}</Text>
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
