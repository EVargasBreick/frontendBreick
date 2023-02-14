import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import File1 from "../../assets/file2b.png";
import NewFile from "../../assets/newFile.png";
import Image from "react-bootstrap/Image";
import Prod from "../../assets/prod.png";
import { useNavigate } from "react-router-dom";
import "../../styles/generalStyle.css";

export default function Produccion({
  toggleSub,
  redirectOnClick,
  toggledProd,
}) {
  return (
    <SubMenu
      onClick={() => {
        toggleSub(1);
      }}
      breakpoint="m"
      title="Modulo Produccion"
      open={toggledProd}
      icon={<Image src={Prod} className="compIcon"></Image>}
    >
      <MenuItem onClick={() => redirectOnClick("/nuevoProducto")}>
        <Image src={File1} className="icon"></Image>
        Crear Producto
      </MenuItem>
      <MenuItem onClick={() => redirectOnClick("/cargarProductos")}>
        <Image src={NewFile} className="icon"></Image>
        Cargar Prod a Almacen
      </MenuItem>
    </SubMenu>
  );
}
