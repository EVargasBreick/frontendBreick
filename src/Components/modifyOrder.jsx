import React from "react";
import Display from "./display";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import FormModifyOrders from "./formModifyOrder";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function ModifyOrder() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      console.log("Rol del usuario:", JSON.parse(Cookies.get("userAuth")).rol);
      if (JSON.parse(Cookies.get("userAuth")).rol < 10) {
        console.log("Todo bien");
      } else {
        navigate("/principal");
        console.log("Error");
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
          <FormModifyOrders />
        </div>
      </div>
    </div>
  );
}
