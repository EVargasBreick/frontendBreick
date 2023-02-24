import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";

import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";

import Image from "react-bootstrap/Image";

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

import "../../styles/generalStyle.css";

export default function Ventas({ toggleSub, redirectOnClick, toggledVent }) {
  return (
    <SubMenu
      title="Modulo Ventas"
      onClick={() => {
        toggleSub(3);
      }}
      open={toggledVent}
      icon={<Image src={Flag} className="compIcon"></Image>}
    >
      <div>Clientes</div>
      <MenuItem onClick={() => redirectOnClick("/regCliente")}>
        <Image src={Client} className="icon"></Image>Gestion de Clientes
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/buscarCliente")}>
        <Image src={newClient} className="icon"></Image>Modificacion de Clientes
      </MenuItem>
      <div>Pedidos</div>
      <MenuItem onClick={() => redirectOnClick("/regPedido")}>
        <Image src={newOrder} className="icon"></Image>Registro de Pedido
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/modPedidos")}>
        <Image src={leftArrow} className="icon"></Image>
        Modificar/Cancelar Pedido
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/pedidos/facturar")}>
        <Image src={Invoice} className="icon"></Image>Facturar Pedidos
      </MenuItem>
      <MenuItem>
        {" "}
        <Image src={cancelInvoice} className="icon"></Image>Anular Facturas
      </MenuItem>
      <div>Productos</div>
      <MenuItem onClick={() => redirectOnClick("/traspaso")}>
        {" "}
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso productos
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/packs/registrar")}>
        {" "}
        <Image src={Star} className="icon inverted"></Image>
        Registrar Pack
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/packs/asignar")}>
        {" "}
        <Image src={Star} className="icon inverted"></Image>
        Asignar/Retirar Packs
      </MenuItem>
      {/*<div>En Desarrollo ...</div>
      <MenuItem>
        <Image src={cancelSample} className="icon"></Image> Anular Muestras
      </MenuItem>
      <MenuItem>
        <Image src={Printer} className="icon"></Image>Reimpresion de Facturas
      </MenuItem>
      <MenuItem>
        <Image src={Printer} className="icon"></Image>Reimpresion de Muestras
      </MenuItem>
      <MenuItem>
        <Image src={appBooking} className="icon"></Image>Aprobar Reservas
      </MenuItem>
      <MenuItem>
        <Image src={ReturnWare} className="icon"></Image>Devolucion Pedido
        Almacen
      </MenuItem>
      <MenuItem>
        <Image src={Truck} className="icon"></Image>Registrar Viaje
      </MenuItem>
      <MenuItem>
        {" "}
        <Image src={Cross} className="icon"></Image>Cerrar Viaje
      </MenuItem>
      <MenuItem>
        <Image src={Load} className="icon"></Image>Conocimiento de Carga
      </MenuItem>
    */}
    </SubMenu>
  );
}
