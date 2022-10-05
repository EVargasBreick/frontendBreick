import React from "react";

import Display from "./display";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import FormEditClient from "./formEditClient";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
export default function RegisterClient() {
  const location = useLocation();
  useEffect(() => {
    console.log("Props pasados", location.state.id);
  }, []);
  return (
    <div>
      <div className="user">
        <Display />
      </div>
      <div className="form">
        <div className="sidebarDisplay">
          <Sidebar />
        </div>
        <div className="formDisplay">
          <FormEditClient id={location.state.id} />
        </div>
      </div>
    </div>
  );
}
