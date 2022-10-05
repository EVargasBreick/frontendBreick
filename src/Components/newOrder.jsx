import React from "react";
import Display from "./display";
import FormNewOrder from "./formNewOrder";
import Sidebar from "./sidebar";
export default function NewOrder() {
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
          <FormNewOrder />
        </div>
      </div>
    </div>
  );
}
