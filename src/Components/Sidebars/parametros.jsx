import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Map from "../../assets/Map.png";
import Gears from "../../assets/gears.png";
import Truck from "../../assets/truck2.png";
import LoginIcon from "../../assets/login.png";
import News from "../../assets/news.png";
import "../../styles/generalStyle.css";

export default function Parametros({ toggleSub, redirectOnClick, toggledPar }) {
  return (
    <SubMenu
      title="Parametros del sistema"
      onClick={() => {
        toggleSub(7);
      }}
      open={toggledPar}
      icon={<Image src={Gears} className="compIcon"></Image>}
    >
      <MenuItem
        onClick={() => redirectOnClick("/nuevoUsuario")}
        className="menuItem"
      >
        <Image src={LoginIcon} className="icon"></Image> Registro usuarios del
        sistema
      </MenuItem>

      <MenuItem
        onClick={() => redirectOnClick("/editarUsuario")}
        className="menuItem"
      >
        <Image src={Gears} className="icon"></Image>Modificar usuarios del
        sistema
      </MenuItem>

      <MenuItem className="menuItem">
        <Image src={Truck} className="icon"></Image>Registro Vehiculo
      </MenuItem>
      <MenuItem className="menuItem">
        <Image src={Map} className="icon"></Image>Registro Agencia
      </MenuItem>
      <MenuItem className="menuItem">
        <Image src={News} className="icon"></Image>Registro Noticias
      </MenuItem>
    </SubMenu>
  );
}
