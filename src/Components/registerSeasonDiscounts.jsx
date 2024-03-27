import React from "react";
import Display from "./display";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import FormOrdersToReady from "./formOrdersToReady";
import FormRejectedOrders from "./formRejectedOrders";
import FormRegisterSeasonDiscounts from "./formRegisterSeasonDiscounts";
export default function RegisterSeasonDiscounts() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    const permited = [1, 7, 9];
    const userRol = JSON.parse(Cookies.get("userAuth")).rol;
    if (user) {
      //console.log("User rol", userRol);
      if (!permited.includes(userRol)) {
        navigate("/principal");
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
          <FormRegisterSeasonDiscounts />
        </div>
      </div>
    </div>
  );
}
