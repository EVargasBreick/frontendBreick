import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Map from "../../assets/Map.png";
import Invoice from "../../assets/invoice.png";
import cancelInvoice from "../../assets/cancelInvoice.png";
import ReturnWare from "../../assets/returnWare.png";
import Book from "../../assets/book.png";
import Lines from "../../assets/lines.png";
import Chocolate from "../../assets/chocolate.png";
import "../../styles/generalStyle.css";

export default function Agencias({ toggleSub, toggledAg, redirectOnClick }) {
  return (
    <SubMenu
      title="Modulo Agencias"
      onClick={() => {
        toggleSub(4);
      }}
      open={toggledAg}
      icon={<Image src={Map} className="compIcon"></Image>}
    >
      <MenuItem onClick={() => redirectOnClick("/ventaAgencia")}>
        <Image src={Invoice} className="icon"></Image>
        Ventas Agencia
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/facturas/anular")}>
        {" "}
        <Image src={cancelInvoice} className="icon"></Image>Anular Facturas
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/stock/actualizar")}>
        <Image src={ReturnWare} className="icon inverted"></Image>
        Actualizar Stock
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/traspaso")}>
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso productos
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/traspaso/recepcion")}>
        <Image src={ReturnWare} className="icon inverted"></Image>
        Recepcion traspasos
      </MenuItem>

      <MenuItem onClick={() => redirectOnClick("/reportes/ventas/cierre")}>
        <Image src={Book} className="icon"></Image>Reporte cierre diario
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/ventas/general")}>
        <Image src={Book} className="icon"></Image>Reporte libro de ventas
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/ventas/productos")}>
        <Image src={Book} className="icon"></Image>Reporte libro de ventas por
        producto
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/log/kardex")}>
        <Image src={Lines} className="icon"></Image>
        Reporte Kardex Pasado
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/actual/kardex")}>
        <Image src={Chocolate} className="icon"></Image>Reporte Kardex Actual
      </MenuItem>
    </SubMenu>
  );
}
