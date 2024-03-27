import React, { useEffect, useState } from "react";
import {
  changeGroupStatus,
  getProducts,
  updateGroupProducts,
} from "../../services/productServices";
import { Badge, Button, Form, Modal, Table } from "react-bootstrap";
import AlertModal from "./alertModal";
export default function EditGroupProdModal({
  show,
  handleClose,
  group,
  fullList,
}) {
  const [productList, setProductList] = useState([]);
  const [auxProductList, setAuxProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [newGroup, setNewGroup] = useState(group);
  const [alert, setAlert] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  useEffect(() => {
    const pList = getProducts("all");
    pList
      .then((res) => {
        setProductList(res.data.data);
        setAuxProductList(res.data.data);
      })
      .catch((err) => {
        console.log("Error obteniendo productos", err);
      });
  }, []);

  const filterProduct = (value) => {
    setSearch(value);
    const filtered = auxProductList.filter(
      (ap) =>
        ap?.nombreProducto?.toLowerCase().includes(value) ||
        ap.codInterno.includes(value)
    );
    setProductList(filtered);
  };

  const addProduct = (val) => {
    const value = JSON.parse(val);
    const auxNewGroup = [...newGroup];

    const presentProduct = fullList.find(
      (fl) => fl.idProducto == value.idProducto
    );

    if (!presentProduct) {
      const objProd = {
        activo: group[0].activo,
        codInterno: value.codInterno,
        descripcion: group[0].descripcion,
        idGrupo: group[0].idGrupo,
        idGrupoProducto: 0,
        idProducto: value.idProducto,
        nombreProducto: value.nombreProducto,
        precio: group[0].precio,
        precioDeFabrica: value.precioDeFabrica,
      };
      auxNewGroup.push(objProd);
      setNewGroup(auxNewGroup);
    } else {
      setAlert("El producto seleccionado ya se encuentra en otro grupo");
      setIsConfirm(true);
    }
  };

  const removeProduct = (index) => {
    const auxNew = [...newGroup];
    auxNew.splice(index, 1);
    setNewGroup(auxNew);
  };

  const saveChanges = async () => {
    setAlert("Actualizando grupo ...");
    setIsConfirm(true);
    if (group != newGroup) {
      const obj = {
        original: group,
        nuevo: newGroup,
      };
      try {
        await updateGroupProducts(obj);
        setAlert("Grupo actualizado correctamente");
        setTimeout(() => {
          setIsConfirm(false);
          window.location.reload();
        }, 2000);
      } catch (err) {
        setAlert("Error al actualizar el grupo", err);
        console.log("Error", err);
      }
    } else {
      setAlert("No se detectaron cambios en el grupo");
      setIsConfirm(true);
    }
  };

  const changeStatus = async () => {
    setAlert("Cambiando status ...");
    setIsConfirm(true);
    const status = group[0].activo == 1 ? 0 : 1;
    const groupId = group[0].idGrupo;
    try {
      await changeGroupStatus(groupId, status);
      setAlert("Status cambiado correctamente");
      setTimeout(() => {
        setIsConfirm(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      setAlert("Error al cambiar status", err);
      console.log("Error", err);
    }
  };

  return (
    <div>
      <Modal show={show} size="xl">
        <Modal.Header style={{ backgroundColor: "#6a4593", color: "white" }}>
          Editar Grupo de Productos
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              textAlign: "center",
              margin: "0px 0px 10px 0px",
            }}
          >
            Agregar Productos
          </div>
          <Form style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Form.Select
              style={{ width: "40%" }}
              onChange={(e) => addProduct(e.target.value)}
            >
              {productList.map((pl, index) => {
                return (
                  <option value={JSON.stringify(pl)} key={index}>
                    {pl.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
            <div style={{ width: "40%" }}>
              <Form.Control
                type="text"
                value={search}
                onChange={(e) => filterProduct(e.target.value)}
                style={{ marginBottom: "15px" }}
                placeholder="Buscar por nombre / codigo interno"
              />
            </div>
          </Form>
          <div style={{ maxHeight: "50vh", overflow: "auto" }}>
            <Table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Quitar</th>
                </tr>
              </thead>
              <tbody>
                {newGroup.map((entry, index) => {
                  return (
                    <tr key={index}>
                      <td>{entry.nombreProducto}</td>
                      <td>{`${entry?.precioDeFabrica.toFixed(2)} Bs`}</td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          variant="danger"
                          onClick={() => removeProduct(index)}
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => saveChanges()}>
            Guardar Cambios
          </Button>
          <Button variant="warning" onClick={() => changeStatus()}>
            {group[0].activo == 1 ? "Deshabilitar Grupo" : "Habilitar Grupo"}
          </Button>
          <Button variant="danger" onClick={() => handleClose()}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertModal
        alertSec={alert}
        setIsAlertSec={setIsConfirm}
        isAlertSec={isConfirm}
      />
    </div>
  );
}
