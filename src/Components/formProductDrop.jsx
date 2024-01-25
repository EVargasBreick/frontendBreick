import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import loading2 from "../assets/loading2.gif";
import { getProductsWithStock } from "../services/productServices";
import { Button, Form, Table, Image, Modal } from "react-bootstrap";
import LoadingModal from "./Modals/loadingModal";
import { dateString } from "../services/dateServices";
import { composedDrop } from "../services/dropServices";
import { updateStock } from "../services/orderServices";
import { DropComponent } from "./dropComponent";
import { getBranchesPs } from "../services/storeServices";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ReactToPrint from "react-to-print";
export default function FormProductDrop() {
  const [productList, setProductList] = useState([]);
  const [auxproductList, setauxProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alertSec, setAlertSec] = useState("");
  const [isAlertSec, setIsAlertSec] = useState(false);
  const [isError, setIsError] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [userId, setUserid] = useState("");
  const [detalleMotivo, setDetalleMotivo] = useState("");
  const [branchInfo, setBranchInfo] = useState({});
  const [isDrop, setIsDrop] = useState(false);
  const invoiceRef = useRef();
  const dropRef = useRef();
  const [dropId, setDropId] = useState("");
  useEffect(() => {
    const UsuarioAct = Cookies.get("userAuth");
    const sudostore = Cookies.get("sudostore");
    if (UsuarioAct) {
      const idAlmacen = sudostore
        ? sudostore
        : JSON.parse(UsuarioAct).idAlmacen;
      setUserid(JSON.parse(Cookies.get("userAuth")).idUsuario);
      setStoreId(idAlmacen);
      console.log("Id almacen", idAlmacen);
      const prods = getProductsWithStock(idAlmacen, "all");
      prods.then((product) => {
        setProductList(product.data);
        setauxProductList(product.data);
      });
      const suc = getBranchesPs();
      suc.then((resp) => {
        const sucursales = resp.data;
        const alm = idAlmacen;
        const sucur =
          sucursales.find((sc) => alm == sc.idAgencia) == undefined
            ? sucursales.find((sc) => "AL001" == sc.idAgencia)
            : sucursales.find((sc) => alm == sc.idAgencia);
        console.log("Sucur", sucur);
        const branchData = {
          nombre: sucur.nombre,
          dir: sucur.direccion,
          tel: sucur.telefono,
          ciudad: sucur.ciudad,
          nro: sucur.idImpuestos,
        };
        setBranchInfo(branchData);
      });
    }
    console.log("Length", JSON.stringify(selectedProduct).length);
  }, []);
  function filterProducts(value) {
    setSearch(value);
    const newList = auxproductList.filter(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(value.toLowerCase()) ||
        dt.codInterno.toString().includes(value.toString()) ||
        dt.codigoBarras.toString().includes(value.toString())
    );
    setProductList([...newList]);
  }
  function selectProduct(prodId) {
    console.log("idProducto", prodId);
    const prod = auxproductList.find((aux) => aux.idProducto == prodId);
    console.log("Producto seleccionado", prod);
    const prodObj = {
      nombreProducto: prod.nombreProducto,
      codInterno: prod.codInterno,
      idProducto: prod.idProducto,
      cantProducto: 0,
      cant_Actual: prod.cant_Actual,
      precioDeFabrica: prod.precioDeFabrica,
    };
    if (selectedProduct.find((sp) => sp.idProducto == prodId)) {
      setIsError(true);
      setAlert("El producto ya esta en la lista");
      setIsAlert(true);
    } else {
      setSelectedProduct([...selectedProduct, prodObj]);
      setProductList(auxproductList);
    }
  }
  const handleClose = () => {
    setIsAlert(false);
    setIsError(false);
  };

  function changeQuantity(value, index, sp) {
    console.log("Selected product", sp);
    const aux = sp;
    console.log("Test", parseFloat(aux.precioDeFabrica) * parseFloat(value));
    const prodObj = {
      nombreProducto: aux.nombreProducto,
      codInterno: aux.codInterno,
      idProducto: aux.idProducto,
      cantProducto: value,
      cant_Actual: aux.cant_Actual,
      precioDeFabrica: aux.precioDeFabrica,
      total: aux.precioDeFabrica * value,
    };
    console.log("Cambiado", prodObj);
    let auxSelected = [...selectedProduct];
    auxSelected[index] = prodObj;
    setSelectedProduct(auxSelected);
  }

  /*function dropProduct() {
    if (motivo == "") {
      setIsError(true);
      setAlert("Seleccione un motivo");
      setIsAlert(true);
    } else {
      if (selectedProduct.cantProducto < 1) {
        setIsError(true);
        setAlert("Ingrese una cantidad valida");
        setIsAlert(true);
      } else {
        setAlertSec("Dando de baja...");
        setIsAlertSec(true);
        const objBaja = {
          motivo: `${motivo} - ${detalleMotivo}`,
          fechaBaja: dateString(),
          idUsuario: userId,
          idAlmacen: storeId,
          productos: selectedProduct,
          totalbaja: selectedProduct.reduce((accumulator, object) => {
            return accumulator + object.total;
          }, 0),
          vale: 0,
          ci: process.env.REACT_APP_NIT_EMPRESA,
        };
        const bajaRegistrada = registerDrop(objBaja);
        bajaRegistrada.then((res) => {
          setDropId(res.data.id);
          const idBaja = res.data.id;
          const objStock = {
            accion: "take",
            idAlmacen: storeId,
            productos: selectedProduct,
            detalle: `SPRBJ-${idBaja}`,
          };
          const updatedStock = updateStock(objStock);
          updatedStock.then((response) => {
            setAlertSec("Baja registrada correctamente");
            debugger;
            setIsDrop(true);
          });
        });
      }
    }
  }*/

  async function dropProductAlt() {
    if (motivo == "") {
      setIsError(true);
      setAlert("Seleccione un motivo");
      setIsAlert(true);
    } else {
      if (selectedProduct.cantProducto < 1) {
        setIsError(true);
        setAlert("Ingrese una cantidad valida");
        setIsAlert(true);
      } else {
        setAlertSec("Dando de baja...");
        setIsAlertSec(true);
        const objBaja = {
          motivo: `${motivo} - ${detalleMotivo}`,
          fechaBaja: dateString(),
          idUsuario: userId,
          idAlmacen: storeId,
          productos: selectedProduct,
          totalbaja: selectedProduct.reduce((accumulator, object) => {
            return accumulator + object.total;
          }, 0),
          vale: 0,
          ci: process.env.REACT_APP_NIT_EMPRESA,
        };
        //setDropId(res.data.id);

        const objStock = {
          accion: "take",
          idAlmacen: storeId,
          productos: selectedProduct,
        };

        const compObj = {
          baja: objBaja,
          stock: objStock,
        };
        try {
          const createdDrop = await composedDrop(compObj);
          console.log("Baja creada", createdDrop);
          setDropId(createdDrop.data.idCreado);
          setIsDrop(true);
        } catch (error) {
          const errMessage = error.response.data.data.includes(
            "stock_nonnegative"
          )
            ? "El stock requerido de algun producto seleccionado ya no se encuentra disponible"
            : "";
          console.log("Error al crear la baja", errMessage);
          setIsAlertSec(false);
          setAlert(`Error al crear la baja:  ${errMessage}`);
          setIsAlert(true);
        }
      }
    }
  }

  function deleteProduct(index) {
    const auxArray = [...selectedProduct];
    auxArray.splice(index, 1);
    setSelectedProduct(auxArray);
  }

  useEffect(() => {
    if (isDrop) {
      if (invoiceRef.current) {
        invoiceRef.current.click();
      }
    }
  }, [isDrop]);

  const handleDownloadPdfDrop = async () => {
    const element = dropRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = 70;
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`nota_entrega_${dropId}.pdf`);
  };

  function selectOnEnter(e) {
    e.preventDefault();
    const foundId = auxproductList.find(
      (dt) =>
        dt.nombreProducto.toLowerCase().includes(search.toLowerCase()) ||
        dt.codInterno.toString().includes(search.toString()) ||
        dt.codigoBarras.toString().includes(search.toString())
    );
    if (foundId) {
      selectProduct(foundId.idProducto);
    }
  }

  return (
    <div>
      <Modal show={isAlert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje del Sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert}</Modal.Body>
        <Modal.Footer>
          {!isError ? (
            <Button variant="success" onClick={handleClose}>
              Confirmar
            </Button>
          ) : null}
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <LoadingModal isAlertSec={isAlertSec} alertSec={alertSec} />
      <div className="formLabel">BAJA DE PRODUCTOS</div>
      <div>
        <Form onSubmit={(e) => selectOnEnter(e)}>
          <Form.Label>Lista de Productos</Form.Label>
          <Form.Group className="columnForm">
            <Form.Select
              className="mediumForm"
              onChange={(e) => selectProduct(e.target.value)}
            >
              <option>Seleccione un producto</option>
              {productList.map((pl, index) => {
                return (
                  <option value={pl.idProducto} key={index}>
                    {pl.nombreProducto}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="buscar"
              className="mediumForm"
              onChange={(e) => {
                filterProducts(e.target.value);
              }}
              value={search}
            />
          </Form.Group>
        </Form>
      </div>

      <div className="formLabel">Detalles producto seleccionado</div>
      {JSON.stringify(selectedProduct).length > 2 ? (
        <div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              dropProductAlt();
            }}
          >
            <Table>
              <thead className="tableHeader">
                <tr>
                  <th></th>
                  <th>Cod Interno</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Restante</th>
                </tr>
              </thead>
              <tbody className="tableRow">
                {selectedProduct.map((sp, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteProduct(index)}
                        >
                          X
                        </Button>
                      </td>
                      <td>{sp?.codInterno}</td>
                      <td>{sp?.nombreProducto}</td>
                      <td style={{ width: "15%" }}>
                        {
                          <Form.Control
                            value={sp.cantProducto}
                            type="number"
                            required
                            step="any"
                            min={0}
                            max={sp?.cant_Actual}
                            onChange={(e) =>
                              changeQuantity(e.target.value, index, sp)
                            }
                          />
                        }
                      </td>
                      <td>{sp?.cant_Actual - sp?.cantProducto}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Form.Label>Motivo de la baja</Form.Label>
            <Form.Select
              className="columnForm"
              onChange={(e) => setMotivo(e.target.value)}
            >
              <option value={""}>Seleccione un motivo</option>
              <option value={"Presentación mala de empaque/ envoltura"}>
                Presentación mala de empaque/ envoltura
              </option>
              <option value={"Producto vencido"}>Producto vencido</option>
              <option value={"Producto con afloramiento de manteca"}>
                Producto con afloramiento de manteca
              </option>
              <option value={"Producto roto"}>Producto roto</option>
              <option value={"Producto derretido"}>Producto derretido</option>
              <option value={"Devolucion a fabrica"}>
                Devolución a fábrica
              </option>
            </Form.Select>

            {motivo != "" ? (
              <div>
                <Form.Label>Detalle del motivo(opcional)</Form.Label>
                <div>
                  <Form.Control
                    className="columnForm"
                    type="text"
                    onChange={(e) => setDetalleMotivo(e.target.value)}
                    maxLength={150}
                  />
                  <div style={{ textAlign: "start" }}>{`${
                    150 - detalleMotivo.length
                  } caracteres restantes`}</div>
                </div>
              </div>
            ) : null}

            <Button type="submit" className="yellowLarge" variant="warning">
              Dar de baja
            </Button>
          </Form>
        </div>
      ) : null}
      {isDrop ? (
        <div>
          <ReactToPrint
            trigger={() => (
              <button ref={invoiceRef} hidden>
                Print this out!
              </button>
            )}
            content={() => dropRef.current}
            onAfterPrint={() => {
              handleDownloadPdfDrop();
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }}
          />
          <Button>
            <DropComponent
              ref={dropRef}
              branchInfo={branchInfo}
              selectedProducts={selectedProduct}
              cliente={{
                nit: "128153028",
                razonSocial: "INCADEX S.R.L.",
              }}
              dropId={dropId}
              total={selectedProduct.reduce((accumulator, object) => {
                return accumulator + object.total;
              }, 0)}
            />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
