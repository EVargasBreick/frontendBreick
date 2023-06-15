import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { productsService } from "../services/productServices";
import { Loader } from "./loader/Loader";
import { ConfirmModal } from "./Modals/confirmModal";
import ToastComponent from "./Modals/Toast";

const UpdateFormAlt = ({ props, setGetProducts, setProductList }) => {
  useEffect(() => {
    setFormData(props);
  }, [props]);

  const [formData, setFormData] = useState(props);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(toast);
    setGetProducts(true);
    setLoading(true);
    await productsService.updateProduct(formData.idProducto, formData);
    const data = await productsService.getAllProducts();
    setProductList(data);
    setLoading(false);
    setShow(false);
    setToast(!toast);
  };

  return (
    <>
      <ConfirmModal
        show={show}
        handleSubmit={handleSubmit}
        handleCancel={() => setShow(false)}
        title="Confirmar"
        text="¿Desea actualizar el producto?"
      />
      <ToastComponent
        show={toast}
        autoclose={2}
        text="Producto actualizado correctamente"
        type="success"
        setShow={setToast}
      />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
          // show Toast bootstrap
        }}
      >
        <Form.Group controlId="codInterno">
          <Form.Label>Cod Interno</Form.Label>
          <Form.Control
            type="text"
            disabled
            style={{ backgroundColor: "lightGray" }}
            variant="secondary"
            name="codInterno"
            value={formData.codInterno}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="nombreProducto">
          <Form.Label>Nombre Producto</Form.Label>
          <Form.Control
            type="text"
            name="nombreProducto"
            value={formData.nombreProducto}
            onChange={handleInputChange}
          />
        </Form.Group>
        {/* flex bootstrap */}
        <div className="d-flex flex-row gap-2">
          <Form.Group className="flex-grow-1" controlId="activo">
            <Form.Label>Activo</Form.Label>
            <Form.Control
              as="select"
              name="activo"
              value={formData.activo}
              onChange={handleInputChange}
            >
              <option value={1}>Si</option>
              <option value={0}>No</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="flex-grow-1" controlId="aplicaDescuento">
            <Form.Label>Aplica Descuento</Form.Label>
            <Form.Control
              as="select"
              name="aplicaDescuento"
              value={formData.aplicaDescuento}
              onChange={handleInputChange}
            >
              <option value="Si">Si</option>
              <option value="No">No</option>
            </Form.Control>
          </Form.Group>
        </div>
        <div className="d-flex flex-row gap-2">
          <Form.Group className="flex-grow-1" controlId="codigoBarras">
            <Form.Label>Codigo Barras</Form.Label>
            <Form.Control
              type="text"
              name="codigoBarras"
              value={formData.codigoBarras}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="flex-grow-1" controlId="gramajeProducto">
            <Form.Label>Gramaje Producto</Form.Label>
            <Form.Control
              type="number"
              name="gramajeProducto"
              value={formData.gramajeProducto}
              onChange={handleInputChange}
            />
          </Form.Group>
        </div>
        <div className="d-flex flex-row gap-2">
          <Form.Group className="flex-grow-1" controlId="precioDeFabrica">
            <Form.Label>Precio de Fabrica</Form.Label>
            <Form.Control
              type="number"
              name="precioDeFabrica"
              value={formData.precioDeFabrica}
              onChange={handleInputChange}
            />
          </Form.Group>
          {formData.tipoProducto == 6 && (
            <Form.Group className="flex-grow-1" controlId="precioDescuentoFijo">
              <Form.Label>Precio Descuento Fijo</Form.Label>
              <Form.Control
                type="number"
                name="precioDescuentoFijo"
                value={formData.precioDescuentoFijo}
                onChange={handleInputChange}
              />
            </Form.Group>
          )}

          <Form.Group className="flex-grow-1" controlId="precioPDV">
            <Form.Label>Precio PDV</Form.Label>
            <Form.Control
              type="number"
              name="precioPDV"
              value={formData.precioPDV}
              onChange={handleInputChange}
            />
          </Form.Group>
        </div>

        <Button variant="success" className="m-3" type="submit">
          Actualizar
        </Button>
        {loading && <Loader />}
      </Form>
    </>
  );
};

export default UpdateFormAlt;
