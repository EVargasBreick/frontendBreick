import React from "react";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import FormManageOrders from "./formManageOrders";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormAllOrders from "./formAllOrders";
export default function AllOrders() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol == 1 ||
        JSON.parse(Cookies.get("userAuth")).rol == 7 ||
        JSON.parse(Cookies.get("userAuth")).rol == 10 ||
        JSON.parse(Cookies.get("userAuth")).rol == 6 ||
        JSON.parse(Cookies.get("userAuth")).rol == 9 ||
        JSON.parse(Cookies.get("userAuth")).rol == 5
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
          <FormAllOrders />
        </div>
      </div>
    </div>
  );
}
