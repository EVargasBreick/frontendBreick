import React from "react";
import FormRegisterClient from "./formRegisterClient";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
export default function RegisterClient() {
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
          <FormRegisterClient />
        </div>
      </div>
    </div>
  );
}
