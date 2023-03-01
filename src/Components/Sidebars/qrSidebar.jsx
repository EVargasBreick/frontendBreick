import { MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import "../../styles/sidebarStyle.scss";
import "../../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Qr from "../../assets/qricon2.png";
import EQR from "../../assets/EQR.png";
import "../../styles/generalStyle.css";

export default function QrSidebar({ toggleSub, toggledQr }) {
  return (
    <SubMenu
      title="Modulo QR"
      onClick={() => {
        toggleSub(6);
      }}
      open={toggledQr}
      icon={<Image src={Qr} className="compIcon"></Image>}
    >
      <MenuItem className="menuItem">
        <Image src={EQR} className="icon"></Image>Encriptar QR
      </MenuItem>
      <MenuItem className="menuItem">
        <Image src={Qr} className="icon"></Image>Decriptar QR
      </MenuItem>
    </SubMenu>
  );
}
