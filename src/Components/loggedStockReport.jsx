import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormViewTransfer from "./formViewTransfer";
import BodyLoggedStockReport from "./bodyLoggedStockReport";
export default function LoggedStockReport() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol == 3 ||
        JSON.parse(Cookies.get("userAuth")).rol == 11
      ) {
        navigate("/principal");
      } else {
      }
    }
  }, []);
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
          <BodyLoggedStockReport />
        </div>
      </div>
    </div>
  );
}
