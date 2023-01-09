import React from "react";
import BreickSimple from "../assets/BreickSimple.png";
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const TransferPDF = ({ detalle, productos }) => (
  <Document>
    <Page
      style={{
        backgroundColor: "white",
        paddingLeft: "10%",
        paddingRight: "10%",
      }}
      size="LETTER"
    >
      <View style={{ backgroundColor: "white", alignItems: "center" }}>
        <Image src={BreickSimple} style={{ width: "20%" }}></Image>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: "#5cb8b2",
          color: "white",
        }}
      >
        <Text
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            paddingTop: "2%",
            paddingBottom: "2%",
            textAlign: "center",
          }}
        >
          {" Nota de Traspaso "}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          backgroundColor: "#6a4593",
          color: "white",
        }}
      >
        <Text
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            paddingTop: "2%",
            paddingBottom: "2%",
            paddingRight: "32%",
            paddingLeft: "1%",
          }}
        >
          {` Detalle del traspaso: ${detalle.nroOrden} `}
        </Text>
      </View>

      <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            fontSize: "12px",
            width: "33%",
            backgroundColor: "#5cb8b2",
            borderColor: "#45236b",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
          }}
        >
          {" Solicitante "}
        </Text>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            borderColor: "#45236b",
            fontSize: "12px",
            width: "33%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
          }}
        >
          {" Origen "}
        </Text>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            borderColor: "#45236b",
            fontSize: "12px",
            width: "34%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
          }}
        >
          {" Destino "}
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            borderColor: "#45236b",
            fontSize: "12px",
            width: "33%",
            backgroundColor: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            color: "#347571",
          }}
        >
          {" " + detalle.correo}
        </Text>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            fontSize: "12px",
            width: "33%",
            borderColor: "#45236b",
            backgroundColor: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            color: "#347571",
          }}
        >
          {" " + detalle.nombreOrigen}
        </Text>
        <Text
          style={{
            border: "1px",
            fontSize: "12px",
            paddingRight: "2%",
            width: "34%",
            borderColor: "#45236b",
            backgroundColor: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            color: "#347571",
          }}
        >
          {" " + detalle.nombreDestino}
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            fontSize: "12px",
            width: "15%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            borderColor: "#45236b",
          }}
        >
          {" Fecha: "}
        </Text>
        <Text
          style={{
            border: "1px",
            fontSize: "12px",
            paddingRight: "2%",
            paddingLeft: "1%",
            color: "#347571",
            width: "35%",
            backgroundColor: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            borderColor: "#45236b",
          }}
        >
          {" " + detalle.fechaCrea}
        </Text>
        <Text
          style={{
            border: "1px",
            paddingRight: "2%",
            fontSize: "12px",
            width: "15%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            borderColor: "#45236b",
          }}
        >
          {" Estado: "}
        </Text>
        <Text
          style={{
            border: "1px",
            fontSize: "12px",
            paddingRight: "2%",
            paddingLeft: "1%",
            color: "#347571",
            width: "35%",
            backgroundColor: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            borderColor: "#45236b",
          }}
        >
          {" " + detalle.estado == 0
            ? "Pendiente"
            : detalle.estado === 1
            ? "Aprobado"
            : "Cancelado"}
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          backgroundColor: "#6a4593",
          color: "white",
          paddingTop: "1%",
          paddingBottom: "1%",
        }}
      >
        <Text
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            paddingTop: "2%",
            paddingBottom: "2%",
            borderColor: "#45236b",
            paddingTop: "1%",
            paddingBottom: "1%",
            paddingRight: "30%",
            paddingLeft: "1%",
          }}
        >
          {" Detalle de los Productos "}
        </Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Text
          style={{
            fontSize: "12px",
            border: "1px",
            paddingRight: "2%",
            borderColor: "#45236b",
            fontSize: "12px",
            width: "7%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
          }}
        >
          {" Nro "}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            border: "1px",

            borderColor: "#45236b",
            fontSize: "12px",
            width: "18%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            textAlign: "center",
          }}
        >
          {" Codigo Interno "}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            border: "1px",
            borderColor: "#45236b",
            width: "40%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            textAlign: "center",
          }}
        >
          {" Producto "}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            border: "1px",
            textAlign: "center",
            width: "19%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            borderColor: "#45236b",
          }}
        >
          {" Cant. Solicitada "}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            border: "1px",
            textAlign: "center",
            width: "19%",
            backgroundColor: "#5cb8b2",
            color: "white",
            paddingTop: "1%",
            paddingBottom: "3%",
            borderColor: "#45236b",
          }}
        >
          {" Cant. Restante "}
        </Text>
      </View>
      {productos.map((producto, index) => {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
            key={index}
          >
            <Text
              style={{
                fontSize: "12px",
                border: "1px",
                width: "7%",
                backgroundColor: "white",
                paddingTop: "1%",
                paddingBottom: "3%",
                borderColor: "#45236b",
                textAlign: "center",
                color: "#347571",
              }}
            >
              {index + 1}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                border: "1px",
                width: "18%",
                backgroundColor: "white",
                paddingTop: "1%",
                paddingBottom: "3%",
                borderColor: "#45236b",
                paddingLeft: "1%",
                textAlign: "center",
                color: "#347571",
              }}
            >
              {" " + producto.codInterno}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                border: "1px",
                paddingRight: "5%",
                width: "40%",
                backgroundColor: "white",
                paddingTop: "1%",
                borderColor: "#45236b",
                paddingBottom: "3%",
                paddingLeft: "1%",
                alignItems: "center",
                textAlign: "right",
                color: "#347571",
              }}
            >
              {" " + producto.nombreProducto}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                border: "1px",
                paddingRight: "8%",
                width: "19%",
                backgroundColor: "white",
                paddingTop: "1%",
                borderColor: "#45236b",
                paddingBottom: "3%",
                paddingLeft: "1%",
                alignItems: "center",
                textAlign: "right",
                color: "#347571",
              }}
            >
              {" " + producto.cantidadProducto}
            </Text>
            <Text
              style={{
                border: "1px",
                fontSize: "12px",
                width: "19%",
                backgroundColor: "white",
                paddingTop: "1%",
                borderColor: "#45236b",
                paddingBottom: "3%",
                paddingLeft: "1%",
                alignItems: "center",
                paddingRight: "8%",
                textAlign: "right",
                color: "#347571",
              }}
            >
              {" " + producto.cantidadRestante}
            </Text>
          </View>
        );
      })}
      <View style={{ paddingTop: "20%", paddingLeft: "40%" }}>
        <Text
          style={{
            fontSize: "12px",
            borderTopWidth: "2px",
            width: "40%",
            paddingTop: "2%",
            textAlign: "center",
            color: "#347571",
            borderTopColor: "#45236b",
          }}
        >
          Revisado por/Firma
        </Text>
      </View>
      <View style={{ paddingTop: "12%", paddingLeft: "40%" }}>
        <Text
          style={{
            fontSize: "12px",
            borderTopWidth: "2px",
            width: "40%",
            paddingTop: "2%",
            textAlign: "center",
            color: "#347571",
            borderTopColor: "#45236b",
          }}
        >
          Fecha
        </Text>
      </View>
    </Page>
  </Document>
);
