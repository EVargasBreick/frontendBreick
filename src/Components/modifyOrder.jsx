import React from "react";
import Display from "./display";

import "../styles/formLayouts.css";
import Sidebar from "./sidebar";

import FormModifyOrders from "./formModifyOrder";
export default function ModifyOrder() {
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
          <FormModifyOrders />
        </div>
      </div>
    </div>
  );
}
