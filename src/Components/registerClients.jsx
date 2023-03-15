import React from "react";
import FormRegisterClient from "./formRegisterClient";
import Display from "./display";
import "../styles/generalStyle.css";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function RegisterClient() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      if (
        JSON.parse(Cookies.get("userAuth")).rol < 10 ||
        (JSON.parse(Cookies.get("userAuth")).rol == 10 &&
          JSON.parse(Cookies.get("userAuth")).idDepto != 1)
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
          <FormRegisterClient isModal={false} />
        </div>
      </div>
    </div>
  );
}
