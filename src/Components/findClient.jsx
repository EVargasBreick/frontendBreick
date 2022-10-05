import React from "react";
import Display from "./display";
import FormSearchClient from "./formSearchClient";
import Sidebar from "./sidebar";

export default function FindClient() {
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
          <FormSearchClient />
        </div>
      </div>
    </div>
  );
}
