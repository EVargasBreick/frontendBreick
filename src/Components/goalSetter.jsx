import React from "react";
import Display from "./display";
import "../styles/formLayouts.css";
import Sidebar from "./sidebar";
import "../styles/generalStyle.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import FormGoalSetter from "./formGoalSetter";
export default function GoalSetter() {
  const navigate = useNavigate();
  const acceptedRoles = [1, 7, 9];
  useEffect(() => {
    const user = Cookies.get("userAuth");
    if (user) {
      if (!acceptedRoles.includes(JSON.parse(Cookies.get("userAuth")).rol)) {
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
          <FormGoalSetter />
        </div>
      </div>
    </div>
  );
}
