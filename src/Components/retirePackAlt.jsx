import React from "react";
import Display from "./display";

import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import FormRetirePack from "./formRetirePack";
import FormRetirePackAlt from "./formRetirePackAlt";
export default function RetirePackAlt() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol != 9 ||
        JSON.parse(Cookies.get("userAuth")).rol != 8 ||
        JSON.parse(Cookies.get("userAuth")).rol != 1
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
          <FormRetirePackAlt />
        </div>
      </div>
    </div>
  );
}
