import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Map from "../../assets/Map.png";
import Report from "../../assets/report.png";
import Truck from "../../assets/truck2.png";
import Log from "../../assets/log2.png";
import Ticket from "../../assets/ticket.png";
import Star from "../../assets/star.png";
import Book from "../../assets/book.png";
import Lines from "../../assets/lines.png";
import Chocolate from "../../assets/chocolate.png";
import Bill from "../../assets/bill.png";
import Gift from "../../assets/Gift.png";
import Salesman from "../../assets/salesman.png";
import Hand from "../../assets/hand.png";
import "../../styles/generalStyle.css";
export default function Reportes({ toggleSub, toggledRep, redirectOnClick }) {
  return (
    <SubMenu
      title="Modulo Reportes"
      onClick={() => {
        toggleSub(5);
      }}
      open={toggledRep}
      icon={<Image src={Report} className="compIcon"></Image>}
    >
      <MenuItem onClick={() => redirectOnClick("/reportes/ventas/general")}>
        <Image src={Book} className="icon"></Image>Reporte libro de ventas
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/ventas/productos")}>
        <Image src={Book} className="icon"></Image>Reporte libro de ventas por
        producto
      </MenuItem>
      <MenuItem>
        <Image src={Ticket} className="icon"></Image>Reporte facturados por
        vendedor
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/log/kardex")}>
        <Image src={Lines} className="icon"></Image>
        Reporte Kardex Pasado
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/reportes/actual/kardex")}>
        <Image src={Chocolate} className="icon"></Image>Reporte Kardex Actual
      </MenuItem>
      <MenuItem>
        <Image src={Bill} className="icon"></Image>Reporte ventas por vendedores
      </MenuItem>
      <MenuItem>
        <Image src={Gift} className="icon"></Image>Reporte ventas por muestras
      </MenuItem>
      <MenuItem>
        <Image src={Gift} className="icon"></Image>Reporte de muestras
      </MenuItem>
      <MenuItem>
        <Image src={Salesman} className="icon"></Image>Reporte de clientes por
        vendedor
      </MenuItem>
      <MenuItem>
        <Image src={Star} className="icon"></Image>Reporte de productos mas
        vendidos
      </MenuItem>
      <MenuItem>
        <Image src={Salesman} className="icon"></Image>Reporte de ventas
        Vendedor - Cliente
      </MenuItem>
      <MenuItem>
        {" "}
        <Image src={Log} className="icon"></Image>Reporte pedidos
      </MenuItem>
      <MenuItem>
        <Image src={Salesman} className="icon"></Image>Reporte pedidos por
        ayudante
      </MenuItem>
      <MenuItem>
        <Image src={Truck} className="icon"></Image>Reporte viajes cerrados
      </MenuItem>
      <MenuItem>
        <Image src={Hand} className="icon"></Image>Reporte cierre venta
      </MenuItem>
      <MenuItem>
        <Image src={Map} className="icon"></Image>Reporte productos por zona
      </MenuItem>
      <MenuItem>
        <Image src={Salesman} className="icon"></Image>Reporte acumulado por
        vendedor
      </MenuItem>
      <MenuItem>
        <Image src={Bill} className="icon"></Image>Reporte ventas por
        transferencias
      </MenuItem>
      <MenuItem>
        <Image src={Bill} className="icon"></Image>Reporte de transferencias
      </MenuItem>
    </SubMenu>
  );
}
