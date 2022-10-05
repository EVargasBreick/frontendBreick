import React from "react";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import FormNewUser from "./formNewUser";
export default function CreateUser() {
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
          <FormNewUser />
        </div>
      </div>
    </div>
  );
}
