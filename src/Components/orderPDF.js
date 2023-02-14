import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

import BreickSimple from "../assets/BreickSimple.png";

// Create Document Component
export const OrderPDF = ({ detalle, productos, codigo }) => {
  return (
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
            {" Nota de Pedido "}
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
            {` Detalle del pedido: ${codigo}`}
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
            {" Vendedor "}
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
            {" Cliente "}
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
            {" Nit "}
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
            {" Zona "}
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
            {" " + detalle.vendedor}
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
            {" " + detalle.cliente}
          </Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "2%",
              paddingLeft: "1%",
              fontSize: "12px",
              width: "33%",
              borderColor: "#45236b",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "#347571",
            }}
          >
            {" " + detalle.nit}
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
            {" " + detalle.zona}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
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
            {" " + detalle.fechaCrea}
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

              borderColor: "#45236b",
              width: "15%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              textAlign: "center",
            }}
          >
            {" Precio "}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              border: "1px",
              textAlign: "center",
              width: "14%",
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
              width: "24%",
              backgroundColor: "#5cb8b2",
              color: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              borderColor: "#45236b",
            }}
          >
            {" Total "}
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
                  width: "40%",
                  backgroundColor: "white",
                  paddingTop: "1%",
                  paddingBottom: "3%",
                  borderColor: "#45236b",
                  paddingLeft: "1%",
                  textAlign: "center",
                  color: "#347571",
                }}
              >
                {" " + producto.producto}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  border: "1px",
                  paddingRight: "5%",
                  width: "15%",
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
                {" " + producto.precio + " Bs "}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  border: "1px",
                  paddingRight: "8%",
                  width: "14%",
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
                {" " + producto.cantidad}
              </Text>
              <Text
                style={{
                  border: "1px",
                  fontSize: "12px",
                  width: "24%",
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
                {" " + producto.total + " Bs "}
              </Text>
            </View>
          );
        })}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "#5cb8b2",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              border: "1px",
              paddingRight: "2%",
              paddingLeft: "1%",
              width: "47%",
              borderBottomColor: "white",
              borderLeftColor: "white",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          ></Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "4%",
              paddingLeft: "1%",
              width: "29%",
              borderColor: "#45236b",
              fontSize: "12px",
              textAlign: "right",
              backgroundColor: "#5cb8b2",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          >
            {" Total: "}
          </Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "5%",
              textAlign: "right",
              fontSize: "12px",
              borderColor: "#45236b",
              paddingLeft: "1%",
              width: "24%",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "#347571",
            }}
          >
            {detalle.montoTotal + " Bs"}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "#5cb8b2",
          }}
        >
          <Text
            style={{
              border: "1px",
              paddingRight: "2%",
              fontSize: "12px",
              borderBottomColor: "white",
              paddingLeft: "1%",
              width: "47%",
              backgroundColor: "white",
              borderTopColor: "white",
              borderLeftColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          ></Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "4%",
              textAlign: "right",
              paddingLeft: "1%",
              fontSize: "12px",
              borderColor: "#45236b",
              width: "29%",
              backgroundColor: "#5cb8b2",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          >
            {" Descuento: "}
          </Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "5%",
              textAlign: "right",
              fontSize: "12px",
              paddingLeft: "1%",
              width: "24%",
              borderColor: "#45236b",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "#347571",
            }}
          >
            {detalle.descuento + "%"}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "#5cb8b2",
          }}
        >
          <Text
            style={{
              border: "1px",
              paddingRight: "2%",
              fontSize: "12px",
              borderBottomColor: "white",
              paddingLeft: "1%",
              width: "47%",
              backgroundColor: "white",
              borderTopColor: "white",
              borderLeftColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          ></Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "4%",
              textAlign: "right",
              paddingLeft: "1%",
              fontSize: "12px",
              borderColor: "#45236b",
              width: "29%",
              backgroundColor: "#5cb8b2",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          >
            {" Descuento calculado: "}
          </Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "5%",
              textAlign: "right",
              fontSize: "12px",
              paddingLeft: "1%",
              width: "24%",
              borderColor: "#45236b",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "#347571",
            }}
          >
            {`${detalle["descuento calculado"]} Bs`}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",

            width: "100%",
            backgroundColor: "#5cb8b2",
          }}
        >
          <Text
            style={{
              border: "1px",
              paddingRight: "2%",
              paddingLeft: "1%",
              width: "47%",
              fontSize: "12px",
              borderBottomColor: "white",
              borderTopColor: "white",
              backgroundColor: "white",
              borderLeftColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          ></Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "4%",
              paddingLeft: "1%",
              width: "29%",
              fontSize: "12px",
              textAlign: "right",
              borderColor: "#45236b",
              backgroundColor: "#5cb8b2",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "white",
            }}
          >
            {" Facturado: "}
          </Text>
          <Text
            style={{
              border: "1px",
              paddingRight: "5%",
              textAlign: "right",
              paddingLeft: "1%",
              width: "24%",
              fontSize: "12px",
              borderColor: "#45236b",
              backgroundColor: "white",
              paddingTop: "1%",
              paddingBottom: "3%",
              color: "#347571",
            }}
          >
            {detalle.facturado + " Bs"}
          </Text>
        </View>
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
            Recibido
          </Text>
        </View>
      </Page>
    </Document>
  );
};
