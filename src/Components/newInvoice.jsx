import React from "react";
import { Button } from "react-bootstrap";
import Display from "./display";
import Sidebar from "./sidebar";
import "../styles/buttonsStyles.css";
import "../styles/generalStyle.css";
export default function NewInvoice() {
  return (
    <div>
      <div className="userBar">
        <div></div>
        <Display />
      </div>
      <div className="form">
        <div className="sidebarDisplay">
          <Sidebar />
        </div>
        <div className="formDisplay">
          <div className="tittle">Emision facturas</div>
          <div className="invoiceDisplay">
            <div className="invoiceButtonGroup">
              <div className="invoiceButtons">
                <div className="formLabel">Grupo a facturar</div>
                <div className="buttonContainer">
                  <Button className="largeDarkPurple" variant="warning">
                    Todo
                  </Button>
                </div>
              </div>
              <div className="invoiceButtons">
                <div className="buttonContainer">
                  <Button className="largePurple" variant="warning">
                    Zona
                  </Button>
                </div>
              </div>
              <div className="invoiceButtons">
                <div className="buttonContainer">
                  <Button className="largeDarkCyan" variant="warning">
                    Vendedor
                  </Button>
                </div>
              </div>
              <div className="invoiceButtons">
                <div className="buttonContainer">
                  <Button className="largeCyan" variant="warning">
                    Muestras
                  </Button>
                </div>
              </div>
              <div className="invoiceButtons">
                <div className="buttonContainer">
                  <Button className="largeDarkYellow" variant="warning">
                    Transferencias
                  </Button>
                </div>
              </div>
              <div className="invoiceButtons">
                <div className="buttonContainer">
                  <Button className="largeYellow" variant="warning">
                    Viajes
                  </Button>
                </div>
              </div>
              <div className="invoiceButtons">
                <div className="buttonContainer">
                  <Button className="largeWhite" variant="warning">
                    Mis Facturas
                  </Button>
                </div>
              </div>
            </div>
            <div className="invoiceForm">AQUI EL FORM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
