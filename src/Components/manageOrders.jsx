import React from "react";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import FormManageOrders from "./formManageOrders";
export default function ManageOrders() {
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
          <FormManageOrders />
        </div>
      </div>
    </div>
  );
}
