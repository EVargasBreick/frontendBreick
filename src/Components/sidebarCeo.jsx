import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import { useState, useEffect } from "react";
import "../styles/sidebarStyle.scss";
import "../styles/sidebar.css";
import Image from "react-bootstrap/Image";
import Breick from "../assets/Breick-logo.png";
import Check from "../assets/check.png";
import newOrder from "../assets/newOrder.png";
import Goku from "../assets/goku.png";
import { useNavigate } from "react-router-dom";
import "../styles/generalStyle.css";
import Produccion from "./Sidebars/produccion";
import Ventas from "./Sidebars/ventas";
import Agencias from "./Sidebars/agencias";
import Reportes from "./Sidebars/reportes";
export default function SidebarCeo() {
  const [toggledProd, setToggledProd] = useState(false);
  const [toggledAlm, setToggledAlm] = useState(false);
  const [toggledVent, setToggledVent] = useState(false);
  const [toggledAg, setToggledAg] = useState(false);
  const [toggledQr, setToggledQr] = useState(false);
  const [toggledRep, setToggledRep] = useState(false);
  const [toggledPar, setToggledPar] = useState(false);
  const [toggledRut, setToggledRut] = useState(false);
  const [toggledMan, setToggledMan] = useState(false);
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
    if (selected === 0) {
      setToggledMan(!toggledMan);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 1) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(!toggledProd);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 2) {
      setToggledMan(false);
      setToggledAlm(!toggledAlm);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 3) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(!toggledVent);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 4) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(!toggledAg);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 5) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(!toggledRep);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 6) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(!toggledQr);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(false);
    }
    if (selected === 7) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(!toggledPar);
      setToggledRut(false);
    }
    if (selected === 8) {
      setToggledMan(false);
      setToggledAlm(false);
      setToggledProd(false);
      setToggledVent(false);
      setToggledAg(false);
      setToggledQr(false);
      setToggledRep(false);
      setToggledPar(false);
      setToggledRut(!toggledRut);
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
            <SubMenu
              onClick={() => {
                toggleSub(0);
              }}
              breakpoint="m"
              title="Modulo Gerencia"
              open={toggledMan}
              icon={<Image src={Goku} className="compIcon"></Image>}
            >
              <MenuItem onClick={() => redirectOnClick("/adminTraspaso")}>
                <Image src={Check} className="icon"></Image>Aprobar Traspasos
              </MenuItem>
              <MenuItem onClick={() => redirectOnClick("/verTraspaso")}>
                <Image src={newOrder} className="icon"></Image>Ver Traspasos
              </MenuItem>
            </SubMenu>
            <Produccion
              toggleSub={toggleSub}
              redirectOnClick={redirectOnClick}
              toggledProd={toggledProd}
            />

            <Ventas
              toggleSub={toggleSub}
              redirectOnClick={redirectOnClick}
              toggledVent={toggledVent}
            />
            <Agencias
              toggleSub={toggleSub}
              redirectOnClick={redirectOnClick}
              toggledAg={toggledAg}
            />
            <Reportes
              toggleSub={toggleSub}
              redirectOnClick={redirectOnClick}
              toggledRep={toggledRep}
            />
          </Menu>
        </Menu>
      </ProSidebar>
    </div>
  );
}
