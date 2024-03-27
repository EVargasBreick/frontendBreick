import React from "react";
import Display from "./display";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import FormOrdersToReady from "./formOrdersToReady";
import FormRejectedOrders from "./formRejectedOrders";
export default function RejectedOrders() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    const parsed = JSON.parse(user);
    const permitted = [1, 7, 11, 13];
    if (user) {
      if (!permitted.includes(parsed.rol)) {
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
          <FormRejectedOrders />
        </div>
      </div>
    </div>
  );
}
