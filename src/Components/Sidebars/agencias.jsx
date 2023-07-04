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
import newClient from "../../assets/newClient.png";
import Printer from "../../assets/printer.png";
import "../../styles/generalStyle.css";
import Cross from "../../assets/cross.png";
import Hand from "../../assets/hand.png";
import Star from "../../assets/star.png";
import HStar from "../../assets/hStar.png";
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
        onClick={() => redirectOnClick("/ventas/agencia")}
        className="menuItem"
      >
        <Image src={Invoice} className="icon"></Image>
        Ventas Agencia
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/facturasanular")}
        className="menuItem"
      >
        {" "}
        <Image src={cancelInvoice} className="icon"></Image>Anular Facturas
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/facturasReimprimir")}
        className="menuItem"
      >
        {" "}
        <Image src={Printer} className="icon"></Image>Reimprimir Facturas
      </MenuItem>

      {isInterior ? (
        <MenuItem
          onClick={() => redirectOnClick("/pedidos/facturacion")}
          className="menuItem"
        >
          <Image src={Invoice} className="icon"></Image>Facturar Pedidos
        </MenuItem>
      ) : null}
      {/*<MenuItem
        onClick={() => redirectOnClick("/stock/actualizar")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Actualizar Stock
      </MenuItem>*/}
      <MenuItem
        onClick={() => redirectOnClick("/buscarCliente")}
        className="menuItem"
      >
        <Image src={newClient} className="icon"></Image>Modificacion de Clientes
      </MenuItem>
      {/*<MenuItem
        onClick={() => redirectOnClick("/traspaso")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso productos
      </MenuItem>*/}
      <MenuItem
        onClick={() => redirectOnClick("/traspaso")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso entre agencias
      </MenuItem>
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
        onClick={() => redirectOnClick("/packsasignar")}
        className="menuItem"
      >
        {" "}
        <Image src={Star} className="icon inverted"></Image>
        Armar Packs
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/packsretirar")}
        className="menuItem"
      >
        {" "}
        <Image src={HStar} className="icon inverted"></Image>
        Desarmar Packs
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
      <MenuItem
        onClick={() => redirectOnClick("/reportes/bajas/general")}
        className="menuItem"
      >
        <Image src={Hand} className="icon"></Image>Reporte libro de bajas
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
