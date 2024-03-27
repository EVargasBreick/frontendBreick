import React from "react";
import Display from "./display";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BodyLogKardex from "./bodyLogKardex";
export default function LogKardexReport() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    const notpermitted = [4, 3, 11];
    const parsed = JSON.parse(Cookies.get("userAuth")).rol;
    if (user) {
      if (notpermitted.includes(parsed)) {
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
          <BodyLogKardex />
        </div>
      </div>
    </div>
  );
}
