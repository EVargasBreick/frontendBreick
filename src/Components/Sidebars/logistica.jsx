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
import Cross from "../../assets/cross.png";
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
      <MenuItem onClick={() => redirectOnClick("/adminPedidos")}>
        <Image src={Check} className="icon"></Image>Aprobar Pedido
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/traspaso")}>
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso entre agencias
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/traspaso/recargar")}>
        <Image src={ReturnWare} className="icon inverted"></Image>
        Traspaso a agencias
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/adminTraspaso")}>
        <Image src={Check} className="icon"></Image>Aprobar Traspasos
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/traspasos/editar")}>
        <Image src={leftArrow} className="icon"></Image>
        Modificar Traspaso
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/verTraspaso")}>
        <Image src={newOrder} className="icon"></Image>Ver Traspasos
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/rechazados")}>
        <Image src={Cross} className="icon"></Image>Ver Ped/Trasp Rechazados
      </MenuItem>
    </SubMenu>
  );
}
