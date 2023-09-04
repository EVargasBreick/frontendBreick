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
    const list = [1, 7, 10, 9];
    const userA = JSON.parse(Cookies.get("userAuth")).rol;
    if (user) {
      if (!list.includes(userA)) {
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
          <FormManageTransfer />
        </div>
      </div>
    </div>
  );
}
