import React from "react";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormStoreRefill from "./formStoreRefill";
export default function StoreRefill() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol != 1 &&
        JSON.parse(Cookies.get("userAuth")).rol != 10 &&
        JSON.parse(Cookies.get("userAuth")).rol != 6
      ) {
        console.log("No tiene", JSON.parse(Cookies.get("userAuth")).rol);
        navigate("/principal");
      } else {
        console.log("tiene");
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
          <FormStoreRefill />
        </div>
      </div>
    </div>
  );
}
