import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import Image from "react-bootstrap/Image";

import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import "../../styles/generalStyle.css";
import Book from "../../assets/book.png";
import Flag from "../../assets/flag1.png";
import Truck from "../../assets/truck2.png";
import leftArrow from "../../assets/leftArrow.png";
import Client from "../../assets/client.png";
import newClient from "../../assets/newClient.png";
import newOrder from "../../assets/newOrder.png";
import Invoice from "../../assets/invoice.png";
import cancelInvoice from "../../assets/cancelInvoice.png";
import cancelSample from "../../assets/cancelSample.png";
import Printer from "../../assets/printer.png";
import appBooking from "../../assets/approveBook.png";
import ReturnWare from "../../assets/returnWare.png";
import Cross from "../../assets/cross.png";
import Load from "../../assets/load.png";
import Star from "../../assets/star.png";
import Chocolate from "../../assets/chocolate.png";
import Map from "../../assets/Map.png";
export default function Interior({ toggleSub, redirectOnClick, toggledInt }) {
  return (
    <SubMenu
      title="Modulo Interior"
      onClick={() => {
        toggleSub(11);
      }}
      open={toggledInt}
      icon={<Image src={Map} className="compIcon"></Image>}
    >
      <div className="menuItem">Agencias</div>
      <MenuItem
        onClick={() => redirectOnClick("/ventaAgencia")}
        className="menuItem"
      >
        <Image src={Invoice} className="icon"></Image>
        Ventas Agencia
      </MenuItem>
      <div className="menuItem">Almacenes</div>
      <MenuItem
        onClick={() => redirectOnClick("/traspaso/recepcion")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Recepción traspasos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/traspaso/recargar")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso a agencias
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/productos/baja")}
        className="menuItem"
      >
        <Image src={Cross} className="icon"></Image>Baja Productos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/stock/actualizar")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Actualizar Stock
      </MenuItem>
      <div className="menuItem">Clientes</div>
      <MenuItem
        onClick={() => redirectOnClick("/regCliente")}
        className="menuItem"
      >
        <Image src={Client} className="icon"></Image>Gestion de Clientes
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/buscarCliente")}
        className="menuItem"
      >
        <Image src={newClient} className="icon"></Image>Modificacion de Clientes
      </MenuItem>
      <div className="menuItem">Pedidos</div>

      <MenuItem
        onClick={() => redirectOnClick("/regPedido")}
        className="menuItem"
      >
        <Image src={newOrder} className="icon"></Image>Registro de Pedido
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/modPedidos")}
        className="menuItem"
      >
        <Image src={leftArrow} className="icon"></Image>
        Modificar/Cancelar Pedido
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/alistarPedidos")}
        className="menuItem"
      >
        <Image src={appBooking} className="icon"></Image>Alistar Pedidos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/pedidos/facturar")}
        className="menuItem"
      >
        <Image src={Invoice} className="icon"></Image>Facturar Pedidos
      </MenuItem>
      <MenuItem
        className="menuItem"
        onClick={() => redirectOnClick("/facturas/anular")}
      >
        {" "}
        <Image src={cancelInvoice} className="icon"></Image>Anular Facturas
      </MenuItem>
      <div className="menuItem">Reportes</div>
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
        onClick={() => redirectOnClick("/reportes/actual/kardex")}
        className="menuItem"
      >
        <Image src={Chocolate} className="icon"></Image>Reporte Kardex Actual
      </MenuItem>
    </SubMenu>
  );
}