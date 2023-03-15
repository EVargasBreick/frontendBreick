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
import SidebarAlmaceneros from "./sidebarAlmaceneros";
import SidebarInterior from "./sidebarInterior";
export default function Sidebar() {
  const [rol, setRol] = useState(0);
  const [depto, setDepto] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    if (UsuarioAct) {
      setRol(JSON.parse(UsuarioAct).rol);
      setDepto(JSON.parse(UsuarioAct).idDepto);
    }
  }, []);
  if (rol == 1 && depto == 1) {
    return <SidebarAdmin />;
  } else {
    if (rol == 2) {
      return <SidebarStoreSales />;
    } else {
      if ((rol == 3 || rol == 5 || rol == 6) && depto == 1) {
        return <SidebarCorpSales />;
      } else {
        if (rol == 4 && depto == 1) {
          return <SidebarRouteSales />;
        } else {
          if (rol == 7 && depto == 1) {
            return <SidebarCeo />;
          } else {
            if ((rol == 8 || rol == 9) && depto == 1) {
              return <SidebarSudoSales />;
            } else {
              if (rol == 10 && depto == 1) {
                return <SidebarWarehousing />;
              } else {
                if (rol == 11 && depto == 1) {
                  return <SidebarAlmaceneros />;
                } else {
                  if ((rol == 10 || rol == 5 || rol == 6) && depto != 1) {
                    return <SidebarInterior />;
                  } else {
                    return null;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
