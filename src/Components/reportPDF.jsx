import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

import BreickSimple from "../assets/BreickSimple.png";

// Create Document Component
export const ReportPDF = ({ productos, fecha }) => {
  return (
    <Document>
      <Page
        style={{
          backgroundColor: "white",
          paddingLeft: "10%",
          paddingRight: "10%",
        }}
        size="LETTER"
        wrap
      >
        <View style={{ backgroundColor: "white", alignItems: "center" }} fixed>
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
            {" Reporte de Kardex "}
          </Text>
        </View>

        <View
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
          fixed
        >
          <Text
            style={{
              border: "1px",
              paddingRight: "2%",
              fontSize: "12px",
              width: "12%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "1%",
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
              width: "88%",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "1%",
              borderColor: "#45236b",
            }}
          >
            {" " + fecha}
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
        <View
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
          fixed
        >
          <Text
            style={{
              fontSize: "12px",
              border: "1px",
              paddingRight: "2%",
              borderColor: "#45236b",
              fontSize: "12px",
              width: "6%",
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
              width: "12%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              textAlign: "center",
            }}
          >
            {" Codigo "}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              border: "1px",
              borderColor: "#45236b",
              width: "35%",
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
              width: "11%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              borderColor: "#45236b",
            }}
          >
            {" Precio "}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              border: "1px",
              textAlign: "center",
              width: "13%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              borderColor: "#45236b",
            }}
          >
            {" Cantidad "}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              border: "1px",
              textAlign: "center",
              width: "23%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              borderColor: "#45236b",
            }}
          >
            {" Ag/Alm "}
          </Text>
        </View>
        {productos.map((producto, index) => {
          return (
            <View
              wrap={false}
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
                  width: "6%",
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
                  width: "12%",
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
                  width: "35%",
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
                  paddingRight: "9%",
                  width: "11%",
                  backgroundColor: "white",
                  paddingTop: "1%",
                  borderColor: "#45236b",
                  paddingBottom: "3%",
                  paddingLeft: "1%",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#347571",
                }}
              >
                {" " + producto.precioDeFabrica + " Bs "}
              </Text>
              <Text
                style={{
                  border: "1px",
                  fontSize: "12px",
                  width: "13%",
                  backgroundColor: "white",
                  paddingTop: "1%",
                  borderColor: "#45236b",
                  paddingBottom: "3%",
                  paddingLeft: "1%",
                  alignItems: "center",
                  paddingRight: "6%",
                  textAlign: "center",
                  color: "#347571",
                }}
              >
                {" " + producto.cantidad}
              </Text>
              <Text
                style={{
                  border: "1px",
                  fontSize: "12px",
                  width: "23%",
                  backgroundColor: "white",
                  paddingTop: "1%",
                  borderColor: "#45236b",
                  paddingBottom: "3%",
                  paddingLeft: "1%",
                  alignItems: "center",
                  paddingRight: "5%",
                  textAlign: "right",
                  color: "#347571",
                }}
              >
                {" " + producto.NombreAgencia}
              </Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
