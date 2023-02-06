import React from "react";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import FormNewTransfer from "./formNewTransfer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormRouteTransfer from "./formRouteTransfer";
export default function RouteTransfer() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      console.log("Rol del usuario:", JSON.parse(Cookies.get("userAuth")).rol);
      if (JSON.parse(Cookies.get("userAuth")).rol == 3) {
        navigate("/principal");
        console.log("Error");
      } else {
        console.log("Todo bien");
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
          <FormRouteTransfer />
        </div>
      </div>
    </div>
  );
}
