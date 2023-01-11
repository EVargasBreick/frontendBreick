import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import React from "react";
import { useState, useEffect } from "react";
import "../styles/sidebarStyle.scss";
import "../styles/sidebar.css";
import File1 from "../assets/file2b.png";
import NewFile from "../assets/newFile.png";
import Image from "react-bootstrap/Image";
import Prod from "../assets/prod.png";
import Barcode from "../assets/barcode1.png";
import Flag from "../assets/flag1.png";
import Map from "../assets/Map.png";
import Report from "../assets/report.png";
import Qr from "../assets/qricon2.png";
import Gears from "../assets/gears.png";
import Truck from "../assets/truck2.png";
import Breick from "../assets/Breick-logo.png";
import Check from "../assets/check.png";
import leftArrow from "../assets/leftArrow.png";
import Client from "../assets/client.png";
import newClient from "../assets/newClient.png";
import newOrder from "../assets/newOrder.png";
import Invoice from "../assets/invoice.png";
import cancelInvoice from "../assets/cancelInvoice.png";
import cancelSample from "../assets/cancelSample.png";
import Printer from "../assets/printer.png";
import appBooking from "../assets/approveBook.png";
import ReturnWare from "../assets/returnWare.png";
import Cross from "../assets/cross.png";
import Load from "../assets/load.png";
import Log from "../assets/log2.png";
import Ticket from "../assets/ticket.png";
import Campaign from "../assets/campaign.png";
import Star from "../assets/star.png";
import hStar from "../assets/hStar.png";
import Book from "../assets/book.png";
import Lines from "../assets/lines.png";
import Chocolate from "../assets/chocolate.png";
import Bill from "../assets/bill.png";
import Gift from "../assets/Gift.png";
import Salesman from "../assets/salesman.png";
import EQR from "../assets/EQR.png";
import LoginIcon from "../assets/login.png";
import Screen from "../assets/screen.png";
import News from "../assets/news.png";
import Hand from "../assets/hand.png";
import { useNavigate } from "react-router-dom";
import "../styles/generalStyle.css";
export default function SidebarStoreSales() {
  const [toggled, setToggled] = useState(false);
  const [toggledProd, setToggledProd] = useState(false);
  const [toggledAlm, setToggledAlm] = useState(false);
  const [toggledVent, setToggledVent] = useState(false);
  const [toggledAg, setToggledAg] = useState(false);
  const [toggledQr, setToggledQr] = useState(false);
  const [toggledRep, setToggledRep] = useState(false);
  const [toggledPar, setToggledPar] = useState(false);
  const [toggledRut, setToggledRut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  function toggleCollapsed() {
    setToggled(!toggled);
  }
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
    if (selected === 1) {
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
              title="Modulo Agencias"
              onClick={() => {
                toggleSub(4);
              }}
              open={toggledAg}
              icon={<Image src={Map} className="compIcon"></Image>}
            >
              <MenuItem onClick={() => redirectOnClick("/ventaAgencia")}>
                <Image src={newOrder} className="icon"></Image>
                Ventas Agencia
              </MenuItem>

              <MenuItem onClick={() => redirectOnClick("/traspaso")}>
                <Image src={ReturnWare} className="icon inverted"></Image>
                Traspaso productos
              </MenuItem>
              <MenuItem>
                <Image src={Ticket} className="icon"></Image>Registro de Vales
              </MenuItem>
              <MenuItem>
                <Image src={Campaign} className="icon"></Image>Registro de
                campanias
              </MenuItem>
              <MenuItem>
                <Image src={Star} className="icon"></Image>Registro Pack
              </MenuItem>
              <MenuItem>
                <Image src={hStar} className="icon"></Image>Eliminar Pack
              </MenuItem>
            </SubMenu>
          </Menu>
        </Menu>
      </ProSidebar>
    </div>
  );
}
