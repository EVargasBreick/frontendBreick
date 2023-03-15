import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import { useState, useEffect } from "react";
import "../styles/sidebarStyle.scss";
import "../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Breick from "../assets/Breick-logo.png";
import { useNavigate } from "react-router-dom";
import "../styles/generalStyle.css";
import Produccion from "./Sidebars/produccion";
import Logistica from "./Sidebars/logistica";
import Almacenes from "./Sidebars/almacenes";
import Ventas from "./Sidebars/ventas";
import Agencias from "./Sidebars/agencias";
import Reportes from "./Sidebars/reportes";
import Parametros from "./Sidebars/parametros";
import RutaSidebar from "./Sidebars/rutaSidebar";
import Interior from "./Sidebars/interior";
export default function SidebarInterior() {
  const [toggledInt, setToggledInt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  function redirectOnClick(path) {
    navigate(path);
  }
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 950) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize(); // set the initial state on mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  function toggleSub(selected) {
    console.log("Test", selected);
    if (selected === 11) {
      setToggledInt(!toggledInt);
    }
  }
  return (
    <div className="pSidebar">
      <ProSidebar
        collapsed={isMobile}
        className="sidebarComponent"
        collapsedWidth={"100%"}
      >
        <Menu>
          <MenuItem
            onClick={() => {
              redirectOnClick("/principal");
            }}
            icon={<Image src={Breick} className="compIcon"></Image>}
          >
            BREICK
          </MenuItem>
          <Menu iconShape="square">
            <Interior
              toggleSub={toggleSub}
              redirectOnClick={redirectOnClick}
              toggledInt={toggledInt}
            />
          </Menu>
        </Menu>
      </ProSidebar>
    </div>
  );
}
