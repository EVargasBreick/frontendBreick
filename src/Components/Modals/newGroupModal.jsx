import React, { useEffect, useState } from "react";
import {
  createProductGroup,
  getProductGroups,
  getProducts,
  updateGroupProducts,
} from "../../services/productServices";
import { Badge, Button, Form, Modal, Table } from "react-bootstrap";
import AlertModal from "./alertModal";
export default function NewGroupProdModal({ show, handleClose }) {
  const [productList, setProductList] = useState([]);
  const [auxProductList, setAuxProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupPrice, setGroupPrice] = useState(0);
  const [newGroup, setNewGroup] = useState([]);
  const [alert, setAlert] = useState("");
  const [fullList, setFullList] = useState([]);
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

    const groupL = getProductGroups();
    groupL
      .then((res) => {
        setFullList(res.data);
      })
      .catch((err) => console.log("Error al obtener los grupos", err));
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
      const productObj = {
        idProducto: value.idProducto,
        nombreProducto: value.nombreProducto,
        precioDeFabrica: value.precioDeFabrica,
      };
      auxNewGroup.push(productObj);
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
    if (groupName != "") {
      setAlert("Creando grupo ...");
      setIsConfirm(true);
      const bodyObj = {
        detalles: {
          descripcion: groupName,
          precio: groupPrice,
        },
        productos: newGroup,
      };
      try {
        await createProductGroup(bodyObj);
        setAlert("Grupo creado correctamente");
        setTimeout(() => {
          setIsConfirm(false);
          window.location.reload();
        }, 20000);
      } catch (err) {
        setAlert("Error al crear el grupo");
        setIsConfirm(true);
        console.log(err);
      }
    } else {
      setAlert("Por favor ingrese un nombre para el grupo");
      setIsConfirm(true);
    }
  };

  return (
    <div>
      <Modal show={show} size="xl">
        <Modal.Header style={{ backgroundColor: "#6a4593", color: "white" }}>
          Editar Grupo de Productos
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div
              style={{
                textAlign: "center",
                margin: "20px 0px 20px 0px",
              }}
            >
              Datos del grupo
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                margin: "20px 0px 30px 0px",
              }}
            >
              <div style={{ width: "40%" }}>
                <Form.Label>Nombre del grupo</Form.Label>
                <Form.Control
                  placeholder="ingrese nombre del grupo"
                  onChange={(e) => setGroupName(e.target.value)}
                  value={groupName}
                />
              </div>
              <div style={{ width: "40%" }}>
                <Form.Label>Precio del grupo</Form.Label>
                <Form.Control
                  placeholder="ingrese precio del grupo"
                  type="number"
                  min={0}
                  onChange={(e) => setGroupPrice(e.target.value)}
                  value={groupPrice}
                />
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                margin: "20px 0px 20px 0px",
              }}
            >
              Agregar Productos
            </div>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
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
            </div>
          </Form>
          <div style={{ maxHeight: "50vh", overflow: "auto" }}>
            {newGroup.length > 0 && (
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
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => saveChanges()}>
            Crear grupo
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
