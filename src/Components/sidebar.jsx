import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import SidebarAdmin from "./sidebarAdmin";
import SidebarStoreSales from "./sidebarStoreSales";
import SidebarCorpSales from "./sidebarCorpSales";
import SidebarRouteSales from "./sidebarRouteSales";
import SidebarCeo from "./sidebarCeo";
import SidebarSudoSales from "./sidebarSudoSales";
import SidebarWarehousing from "./sidebarWarehousing";
export default function Sidebar() {
  const [rol, setRol] = useState(0);
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setRol(JSON.parse(UsuarioAct).rol);
    }
  }, []);
  if (rol == 1) {
    return <SidebarAdmin />;
  }
  if (rol == 2) {
    return <SidebarStoreSales />;
  }
  if (rol == 3 || rol == 5 || rol == 6) {
    return <SidebarCorpSales />;
  }
  if (rol == 4) {
    return <SidebarRouteSales />;
  }
  if (rol == 7) {
    return <SidebarCeo />;
  }
  if (rol == 8 || rol == 9) {
    return <SidebarSudoSales />;
  }
  if (rol == 10) {
    return <SidebarWarehousing />;
  }
}
