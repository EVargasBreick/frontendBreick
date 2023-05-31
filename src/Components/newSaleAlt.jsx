import React from "react";
import Display from "./display";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import FormNewSaleAlt from "./formNewSaleAlt";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function NewSaleAlt() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol == 2 ||
        JSON.parse(Cookies.get("userAuth")).rol == 1 ||
        JSON.parse(Cookies.get("userAuth")).rol == 7 ||
        JSON.parse(Cookies.get("userAuth")).rol == 9 ||
        JSON.parse(Cookies.get("userAuth")).rol == 6
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
          <FormNewSaleAlt />
        </div>
      </div>
    </div>
  );
}
