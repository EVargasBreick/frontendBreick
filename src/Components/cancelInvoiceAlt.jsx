import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormCancelInvoiceAlt from "./formCancelInvoiceAlt";
export default function CancelInvoiceAlt() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol != 8 ||
        JSON.parse(Cookies.get("userAuth")).rol != 10
      ) {
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
          <FormCancelInvoiceAlt />
        </div>
      </div>
    </div>
  );
}