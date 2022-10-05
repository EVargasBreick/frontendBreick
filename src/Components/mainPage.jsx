import React from "react";
import Display from "./display";
import Sidebar from "./sidebar";
import CartLogo from "../assets/cartLogo.png";
import CartPlus from "../assets/cartPlus.png";
import Square from "../assets/square.png";
import Minus from "../assets/minus.png";
import Add from "../assets/add.png";
import CheckMain from "../assets/checkMain.png";
import GiftMain from "../assets/giftMain.png";
import ProductMain from "../assets/productMain.png";
import { Image, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
export default function MainPage() {
  const { isAuth } = useContext(UserContext);
  const navigate = useNavigate();
  /*useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, []);*/
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {"Pedidos: 1 | \nMuestras: 0\nTransferencias: 0"}
    </Tooltip>
  );

  return (
    <div>
      <div>
        <div className="user">
          <Display />
        </div>
        <div className="form">
          <div className="sidebarDisplay">
            <Sidebar />
          </div>
          <div className="formDisplayWhite">
            <div className="tittle">Inicio</div>
            <div className="mainRow">
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <div className="mainColumn first">
                  <div className="mainCard mCyan">
                    <div className="lgRow">
                      <div className="nData">1</div>
                      <div>Pedidos pendientes</div>
                    </div>
                    <div className="smRow">
                      <div className="summImgCt">
                        <Image src={CartPlus} className="summImg"></Image>
                      </div>
                    </div>
                  </div>
                </div>
              </OverlayTrigger>

              <div className="mainColumn first">
                <div className="mainCard mYellow">
                  <div className="lgRow">
                    <div className="nData">1</div>
                    <div>Pedidos aprobados</div>
                  </div>
                  <div className="smRow">
                    <div className="summImgCt">
                      <Image src={CartLogo} className="summImg"></Image>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mainColumn first">
                <div className="mainCard dPurple">
                  <div className="lgRow">
                    <div className="nData">1</div>
                    <div>Pedidos por facturar</div>
                  </div>
                  <div className="smRow">
                    <div className="summImgCt">
                      <Image src={Square} className="summImg"></Image>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mainColumn first">
                <div className="mainCard mGreen">
                  <div className="lgRow">
                    <div className="nData">1</div>
                    <div>Pedidos Facturados</div>
                  </div>
                  <div className="smRow">
                    <div className="summImgCt">
                      <Image src={CheckMain} className="summImg"></Image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mainRow">
              <div className="mainColumn second">
                <div>
                  <div className="mainCard dYellow">
                    <div className="lgRow">
                      <div className="nData">1</div>
                      <div>Clientes Registrados</div>
                    </div>
                    <div className="smRow">
                      <div className="summImgCt">
                        <Image src={Add} className="summImg"></Image>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mainColumn second">
                <div className="mainCard mPurple">
                  <div className="lgRow">
                    <div className="nData">1</div>
                    <div>Productos Registrados</div>
                  </div>
                  <div className="smRow">
                    <div className="summImgCt">
                      <Image src={ProductMain} className="summImg"></Image>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mainColumn second">
                <div className="mainCard mRed">
                  <div className="lgRow">
                    <div className="nData">1</div>
                    <div>Facturas Anuladas</div>
                  </div>
                  <div className="smRow">
                    <div className="summImgCt">
                      <Image src={Minus} className="summImg"></Image>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mainColumn second">
                <div className="mainCard mBlue">
                  <div className="lgRow">
                    <div className="nData">1</div>
                    <div>Muestras Aprobadas</div>
                  </div>
                  <div className="smRow">
                    <div className="summImgCt">
                      <Image src={GiftMain} className="summImg"></Image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
