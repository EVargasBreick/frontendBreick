import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import leftArrow from "../../assets/leftArrow.png";
import appBooking from "../../assets/approveBook.png";
import Load from "../../assets/load.png";
import "../../styles/generalStyle.css";

export default function Almacenes({ toggleSub, redirectOnClick, toggledAlm }) {
  return (
    <SubMenu
      onClick={() => {
        toggleSub(2);
      }}
      open={toggledAlm}
      title="Modulo Almacenes"
      icon={<Image src={Load} className="compIcon"></Image>}
    >
      <MenuItem
        onClick={() => redirectOnClick("/almacenes/recepcionar-pedidos")}
      >
        <Image src={leftArrow} className="icon"></Image>Pedidos Entrantes
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/alistarPedidos")}>
        <Image src={appBooking} className="icon"></Image>Alistar Pedidos
      </MenuItem>
    </SubMenu>
  );
}
