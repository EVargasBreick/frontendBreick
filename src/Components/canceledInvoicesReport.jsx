import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BodyCanceledInvoicesReport from "./bodyCanceledInvoicesReport";
export default function CanceledInvoicesReport() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    const permitted = [1, 9, 7, 10, 8, 5, 6, 12, 13];
    if (user) {
      const parsed = JSON.parse(Cookies.get("userAuth"));
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
          <BodyCanceledInvoicesReport />
        </div>
      </div>
    </div>
  );
}
