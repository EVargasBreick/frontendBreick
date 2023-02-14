import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Truck from "../../assets/truck2.png";
import Client from "../../assets/client.png";
import Invoice from "../../assets/invoice.png";
import ReturnWare from "../../assets/returnWare.png";
import Book from "../../assets/book.png";
export default function RutaSidebar({
  toggleSub,
  redirectOnClick,
  toggledRut,
}) {
  return (
    <SubMenu
      title="Ruta"
      onClick={() => {
        toggleSub(8);
      }}
      open={toggledRut}
      icon={<Image src={Truck} className="compIcon"></Image>}
    >
      {/*<MenuItem onClick={() => redirectOnClick("/regPedido")}>
          <Image src={Log} className="icon"></Image>Registro de Pedido
        </MenuItem>
        <MenuItem>
          <Image src={Invoice} className="icon"></Image>Emision de
          Facturas
      </MenuItem>*/}
      <MenuItem onClick={() => redirectOnClick("/ventas/ruta")}>
        <Image src={Invoice} className="icon"></Image>
        Ventas Ruta
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/traspasoMovil")}>
        {" "}
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso a ag. Movil
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/regCliente")}>
        <Image src={Client} className="icon"></Image>Gestion de clientes
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/buscarCliente")}>
        <Image src={Client} className="icon"></Image>Modificacion de clientes
      </MenuItem>
      <MenuItem>
        <Image src={Book} className="icon"></Image>
        Reporte cierre de ventas
      </MenuItem>
    </SubMenu>
  );
}
