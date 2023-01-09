import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import FormManageTransfer from "./formManageTransfer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function ManageTransfer() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      console.log("Rol del usuario:", JSON.parse(Cookies.get("userAuth")).rol);
      if (
        JSON.parse(Cookies.get("userAuth")).rol == 1 ||
        JSON.parse(Cookies.get("userAuth")).rol == 7
      ) {
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
          <FormManageTransfer />
        </div>
      </div>
    </div>
  );
}
