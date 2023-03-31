import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
import Cross from "../../assets/cross.png";
export default function Agencias({ toggleSub, toggledAg, redirectOnClick }) {
  const [isInterior, setIsInterior] = useState(false);
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      if (JSON.parse(UsuarioAct).idDepto != 1) {
        setIsInterior(true);
      }
    }
  }, []);
  return (
    <SubMenu
      title="Modulo Agencias"
      onClick={() => {
        toggleSub(4);
      }}
      open={toggledAg}
      icon={<Image src={Map} className="compIcon"></Image>}
    >
      <MenuItem
        onClick={() => redirectOnClick("/ventaAgencia")}
        className="menuItem"
      >
        <Image src={Invoice} className="icon"></Image>
        Ventas Agencia
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/facturas/anular")}
        className="menuItem"
      >
        {" "}
        <Image src={cancelInvoice} className="icon"></Image>Anular Facturas
      </MenuItem>
      {isInterior ? (
        <MenuItem
          onClick={() => redirectOnClick("/pedidos/facturar")}
          className="menuItem"
        >
          <Image src={Invoice} className="icon"></Image>Facturar Pedidos
        </MenuItem>
      ) : null}
      <MenuItem
        onClick={() => redirectOnClick("/stock/actualizar")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Actualizar Stock
      </MenuItem>
      {/*<MenuItem
        onClick={() => redirectOnClick("/traspaso")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso productos
      </MenuItem>*/}
      <MenuItem
        onClick={() => redirectOnClick("/traspaso/recepcion")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Recepcion traspasos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/productos/baja")}
        className="menuItem"
      >
        <Image src={Cross} className="icon"></Image>Baja Productos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/reportes/ventas/cierre")}
        className="menuItem"
      >
        <Image src={Book} className="icon"></Image>Reporte cierre diario
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/reportes/ventas/general")}
        className="menuItem"
      >
        <Image src={Book} className="icon"></Image>Reporte libro de ventas
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/reportes/ventas/productos")}
        className="menuItem"
      >
        <Image src={Book} className="icon"></Image>Reporte libro de ventas por
        producto
      </MenuItem>
      {/*<MenuItem
        onClick={() => redirectOnClick("/reportes/log/kardex")}
        className="menuItem"
      >
        <Image src={Lines} className="icon"></Image>
        Reporte Kardex Pasado
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/reportes/actual/kardex")}
        className="menuItem"
      >
        <Image src={Chocolate} className="icon"></Image>Reporte Kardex Actual
      </MenuItem>*/}
    </SubMenu>
  );
}
