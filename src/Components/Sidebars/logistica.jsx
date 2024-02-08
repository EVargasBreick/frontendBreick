import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Barcode from "../../assets/barcode1.png";
import Check from "../../assets/check.png";
import leftArrow from "../../assets/leftArrow.png";
import newOrder from "../../assets/newOrder.png";
import ReturnWare from "../../assets/returnWare.png";
import Invoice from "../../assets/invoice.png";
import cancelInvoice from "../../assets/cancelInvoice.png";
import Cross from "../../assets/cross.png";
import Lines from "../../assets/lines.png";
import Printer from "../../assets/printer.png";
import { TbShoppingCartCancel } from "react-icons/tb";
import "../../styles/generalStyle.css";

export default function Logistica({ toggleSub, redirectOnClick, toggleLog }) {
  return (
    <SubMenu
      onClick={() => {
        toggleSub(10);
      }}
      open={toggleLog}
      title="Modulo Logistica"
      icon={<Image src={Barcode} className="compIcon"></Image>}
    >
      <div className="menuItem">Pedidos</div>
      <MenuItem
        onClick={() => redirectOnClick("/pedidos")}
        className="menuItem"
      >
        <Image src={newOrder} className="icon"></Image>Ver Pedidos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/adminPedidos")}
        className="menuItem"
      >
        <Image src={Check} className="icon"></Image>Aprobar Pedido
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/pedidos/facturacion")}
        className="menuItem"
      >
        <Image src={Invoice} className="icon"></Image>Facturar Pedidos
      </MenuItem>
      <div className="menuItem">Facturas</div>
      <MenuItem
        className="menuItem"
        onClick={() => redirectOnClick("/facturas/anulacion")}
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
      <MenuItem
        onClick={() => redirectOnClick("/facturar-consignacion")}
        className="menuItem"
      >
        <Image src={Invoice} className="icon"></Image>Facturar Consignaciones
      </MenuItem>
      <div className="menuItem">Traspasos</div>
      <MenuItem
        onClick={() => redirectOnClick("/traspaso")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso entre agencias
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/traspaso/recargar")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso a agencias
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/traspasos/editar")}
        className="menuItem"
      >
        <Image src={leftArrow} className="icon"></Image>
        Modificar Traspaso
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/adminTraspaso")}
        className="menuItem"
      >
        <Image src={Check} className="icon"></Image>Aprobar Traspasoss
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/verTraspaso")}
        className="menuItem"
      >
        <Image src={newOrder} className="icon"></Image>Ver Traspasos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/traspasos/agencia")}
        className="menuItem"
      >
        <Image src={Lines} className="icon"></Image>
        Ver Estado Traspasos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/traspaso/recepcion")}
        className="menuItem"
      >
        <Image src={ReturnWare} className="icon inverted"></Image>
        Recepcion traspasos
      </MenuItem>
      <div className="menuItem">Otros</div>
      <MenuItem
        onClick={() => redirectOnClick("/rechazados")}
        className="menuItem"
      >
        <Image src={Cross} className="icon"></Image>Ver Ped/Trasp Rechazados
      </MenuItem>

      <MenuItem
        onClick={() => redirectOnClick("/productos/baja")}
        className="menuItem"
      >
        <Image src={Cross} className="icon"></Image>Baja Productos
      </MenuItem>
      <MenuItem
        onClick={() => redirectOnClick("/bajas/anular")}
        className="menuItem"
      >
        <TbShoppingCartCancel size="30px" style={{ paddingRight: "5px" }} />
        Anular Baja
      </MenuItem>
    </SubMenu>
  );
}
