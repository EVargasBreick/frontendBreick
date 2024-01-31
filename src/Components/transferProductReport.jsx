import React from "react";
import Display from "./display";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BodyTransferProductReport from "./bodyTransferProductReport";
export default function TransferProductReport() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (JSON.parse(Cookies.get("userAuth")).rol <= 13) {
      } else {
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
          <BodyTransferProductReport />
        </div>
      </div>
    </div>
  );
}
