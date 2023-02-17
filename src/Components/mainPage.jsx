import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { getOrderStatus, getOrderType } from "../services/orderServices";
import { numberOfClients } from "../services/clientServices";
import loading2 from "../assets/loading2.gif";
import { numberOfProducts } from "../services/productServices";
import Cookies from "js-cookie";
import "../styles/generalStyle.css";
import SidebarAdmin from "./sidebarAdmin";
export default function MainPage() {
  const [estados, setEstados] = useState([]);
  const [pendientes, setPendientes] = useState(-1);
  const [aprobados, setAprobados] = useState(-1);
  const [numClientes, setNumClientes] = useState(-1);
  const [numProds, setNumProds] = useState(-1);
  const [normal, setNormal] = useState(0);
  const [muestra, setMuestra] = useState(0);
  const [reserva, setReserva] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      if (JSON.parse(Cookies.get("userAuth")).rol == 2) {
        navigate("/ventaAgencia");
      }
    }
    const stats = getOrderStatus();

    stats.then((response) => {
      console.log("estados", response);
      setEstados(response.data.data);

      const pendientes = response.data.data.find((pd) => pd.estado == 0);

      const cantPen = pendientes != undefined ? pendientes.conteo : 0;
      setPendientes(cantPen);
      const aprobados = response.data.data.find((pd) => pd.estado == 1);
      const cantAp = aprobados != undefined ? aprobados.conteo : 0;
      setAprobados(cantAp);
    });
    const types = getOrderType();
    types.then((type) => {
      const typeArray = type.data.data;
      if (typeArray) {
        typeArray.map((t) => {
          if (t.tipo === "normal") {
            setNormal(t.cant);
          }
          if (t.tipo === "muestra") {
            setMuestra(t.cant);
          }
          if (t.tipo === "reserva") {
            setReserva(t.cant);
          }
        });
      }
    });
    const nClientes = numberOfClients();
    nClientes.then((number) => {
      console.log("Numero clientes", number);
      setNumClientes(number.data.data[0].numeroclientes);
    });
    const nProducts = numberOfProducts();
    nProducts.then((number) => {
      setNumProds(number.data.data[0][0].NumeroProductos);
    });
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {`Normales: ${normal} | \nMuestras: ${muestra}\nReservas: ${reserva}`}
    </Tooltip>
  );

  return (
    <div className="appContainer">
      <div className="userBar">
        <div></div>
        <Display />
      </div>
      <div className="form">
        <div className="sidebarDisplay">
          <SidebarAdmin></SidebarAdmin>
        </div>
        <div className="formDisplayWhite mainOverflow">
          <div className="tittle">Inicio</div>
          <div className="mainRow">
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <div className="dataCard">
                <div className="mainCard mCyan">
                  <div className="lgRow">
                    <div className="nData">
                      {pendientes < 0 ? (
                        <Image src={loading2} style={{ width: "25%" }} />
                      ) : (
                        pendientes
                      )}
                    </div>
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
            <div className="dataCard">
              <div className="mainCard mYellow">
                <div className="lgRow">
                  <div className="nData">
                    {aprobados < 0 ? (
                      <Image src={loading2} style={{ width: "25%" }} />
                    ) : (
                      aprobados
                    )}
                  </div>
                  <div>Pedidos aprobados</div>
                </div>
                <div className="smRow">
                  <div className="summImgCt">
                    <Image src={CartLogo} className="summImg"></Image>
                  </div>
                </div>
              </div>
            </div>
            <div className="dataCard">
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
          </div>
          <div className="mainRow">
            <div className="dataCard ">
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
            <div className="dataCard ">
              <div className="mainCard dYellow">
                <div className="lgRow">
                  <div className="nData">
                    {numClientes < 0 ? (
                      <Image src={loading2} style={{ width: "25%" }} />
                    ) : (
                      numClientes
                    )}
                  </div>
                  <div>Clientes Registrados</div>
                </div>
                <div className="smRow">
                  <div className="summImgCt">
                    <Image src={Add} className="summImg"></Image>
                  </div>
                </div>
              </div>
            </div>
            <div className="dataCard">
              <div className="mainCard mPurple">
                <div className="lgRow">
                  <div className="nData">
                    {" "}
                    {numProds < 0 ? (
                      <Image src={loading2} style={{ width: "25%" }} />
                    ) : (
                      numProds
                    )}
                  </div>
                  <div>Productos Registrados</div>
                </div>
                <div className="smRow">
                  <div className="summImgCt">
                    <Image src={ProductMain} className="summImg"></Image>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mainRow">
            <div className="dataCard">
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
            <div className="dataCard">
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
  );
}
