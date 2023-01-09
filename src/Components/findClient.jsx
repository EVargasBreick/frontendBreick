import React from "react";
import Display from "./display";
import FormSearchClient from "./formSearchClient";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function FindClient() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = Cookies.get("userAuth");

    if (user) {
      console.log("Rol del usuario:", JSON.parse(Cookies.get("userAuth")).rol);
      if (JSON.parse(Cookies.get("userAuth")).rol < 10) {
        console.log("Todo bien");
      } else {
        navigate("/principal");
        console.log("Error");
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
          <FormSearchClient />
        </div>
      </div>
    </div>
  );
}
