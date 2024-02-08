import React, { useEffect, useState } from "react";
import { getProductGroups } from "../services/productServices";
import { Badge, Button, Table } from "react-bootstrap";
import EditGroupProdModal from "./Modals/editGroupProdModal";
import NewGroupProdModal from "./Modals/newGroupModal";
import { Loader } from "./loader/Loader";

export default function BodyGroupedProducts() {
  const [groupList, setGroupList] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupL = getProductGroups();
    groupL
      .then((res) => {
        let uniqueArray = [];
        console.log("Grupos de productos", res.data);
        setFullList(res.data);
        for (const group of res.data) {
          const found = uniqueArray.find((ua) => ua.idGrupo === group.idGrupo);
          if (!found) {
            uniqueArray.push(group);
          }
        }
        setGroupList(uniqueArray);
        setLoading(false);
      })
      .catch((err) => console.log("Error al obtener los grupos", err));
  }, []);

  const handleClose = () => {
    setShowCreate(false);
    setShowEdit(false);
  };

  const openModalEdit = (group) => {
    const groupProducts = fullList.filter((fl) => fl.idGrupo == group);
    setSelectedGroup(groupProducts);
    setShowEdit(true);
  };

  const openModalNew = () => {
    setShowCreate(true);
  };

  return (
    <div>
      <div>
        <div className="formLabel">GRUPOS DE PRODUCTOS</div>
        <div style={{ maxHeight: "80vh", overflow: "auto" }}>
          <Table>
            <thead>
              <tr className="tableHeader" style={{ textAlign: "center" }}>
                <th colSpan={4}>Grupos de productos</th>
              </tr>
              <tr className="tableHeader">
                <th>Grupo</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Ver / Editar</th>
              </tr>
            </thead>
            <tbody>
              {groupList.map((gl, index) => {
                return (
                  <tr key={index} className="tableRow">
                    <td style={{ width: "40%" }}>{gl.descripcion}</td>
                    <td style={{ width: "40%" }}>{`${gl?.precio.toFixed(
                      2
                    )} Bs`}</td>

                    <td style={{ width: "40%" }}>
                      <Badge bg={gl.activo == 1 ? "success" : "danger"}>
                        {gl.activo == 1 ? "Habilitado" : "Deshabilitado"}
                      </Badge>
                    </td>

                    <td style={{ width: "20%", textAlign: "center" }}>
                      {
                        <Button
                          variant="warning"
                          onClick={() => openModalEdit(gl.idGrupo)}
                        >
                          Ver/Editar
                        </Button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div style={{ margin: "15px" }}>
          <Button variant="success" onClick={() => openModalNew()}>
            Crear Grupo
          </Button>
        </div>
      </div>
      {showEdit && (
        <EditGroupProdModal
          show={showEdit}
          handleClose={handleClose}
          group={selectedGroup}
          fullList={fullList}
          setLoading={setLoading}
        />
      )}
      {showCreate && (
        <NewGroupProdModal
          show={showCreate}
          handleClose={handleClose}
          setLoading={setLoading}
        />
      )}
      {loading && <Loader />}
    </div>
  );
}
