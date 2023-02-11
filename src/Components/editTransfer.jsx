import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormEditTransfer from "./formEditTransfer";
export default function EditTransfer() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      console.log("Rol del usuario:", JSON.parse(Cookies.get("userAuth")).rol);
      if (JSON.parse(Cookies.get("userAuth")).rol > 0) {
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
          <FormEditTransfer />
        </div>
      </div>
    </div>
  );
}
