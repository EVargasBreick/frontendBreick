import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/login";

import Display from "./Components/display";
import EditProducts from "./Components/editProducts";
import CreateProduct from "./Components/createProduct";
import ManageOrders from "./Components/manageOrders";
import ModifyOrder from "./Components/modifyOrder";
import RegisterClient from "./Components/registerClients";
import FindClient from "./Components/findClient";
import NewOrder from "./Components/newOrder";
import NewInvoice from "./Components/newInvoice";
import MainPage from "./Components/mainPage";
import { UserProvider } from "./Context/UserContext";
import CreateUser from "./Components/createUser";
import UpdateClients from "./Components/updateClients";
import RequireAuth from "./services/RequireAuth";
import UpdateUser from "./Components/updateUser";
import Transfer from "./Components/transfer";
import ManageTransfer from "./Components/manageTransfer";
import ViewTransfer from "./Components/viewTransfer";
import UploadProducts from "./Components/uploadProducts";
import NewSale from "./Components/newSale";
import LogKardexReport from "./Components/logKardexReport";
import CurrentKardexReport from "./Components/currentKardexReport";
import { InvoiceComponent } from "./Components/invoiceComponent";
import SalesReport from "./Components/salesreport";
import SalesByProductReport from "./Components/salesByProductReport";
import InvoiceOrders from "./Components/invoiceOrders";
function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login></Login>}></Route>
            <Route
              path="/display"
              element={
                <RequireAuth>
                  <Display />
                </RequireAuth>
              }
            />
            <Route
              path="/editarProducto"
              element={
                <RequireAuth>
                  <EditProducts />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/nuevoProducto"
              element={
                <RequireAuth>
                  <CreateProduct />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/adminPedidos"
              element={
                <RequireAuth>
                  <ManageOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/modPedidos"
              element={
                <RequireAuth>
                  <ModifyOrder />
                </RequireAuth>
              }
            />
            <Route
              path="/regCliente"
              element={
                <RequireAuth>
                  <RegisterClient />
                </RequireAuth>
              }
            />
            <Route
              path="/buscarCliente"
              element={
                <RequireAuth>
                  <FindClient />
                </RequireAuth>
              }
            />
            <Route
              path="/regPedido"
              element={
                <RequireAuth>
                  <NewOrder />
                </RequireAuth>
              }
            />
            <Route
              path="/facturar"
              element={
                <RequireAuth>
                  <NewInvoice />
                </RequireAuth>
              }
            />
            <Route
              path="/principal"
              element={
                <RequireAuth>
                  <MainPage />
                </RequireAuth>
              }
            />
            <Route
              path="/nuevoUsuario"
              element={
                <RequireAuth>
                  <CreateUser />
                </RequireAuth>
              }
            />
            <Route
              path="/editarCliente"
              element={
                <RequireAuth>
                  <UpdateClients />
                </RequireAuth>
              }
            />
            <Route
              path="/editarUsuario"
              element={
                <RequireAuth>
                  <UpdateUser />
                </RequireAuth>
              }
            />
            <Route
              path="/traspaso"
              element={
                <RequireAuth>
                  <Transfer />
                </RequireAuth>
              }
            />
            <Route
              path="/adminTraspaso"
              element={
                <RequireAuth>
                  <ManageTransfer />
                </RequireAuth>
              }
            />
            <Route
              path="/verTraspaso"
              element={
                <RequireAuth>
                  <ViewTransfer />
                </RequireAuth>
              }
            />
            <Route
              path="/cargarProductos"
              element={
                <RequireAuth>
                  <UploadProducts />
                </RequireAuth>
              }
            />
            <Route
              path="/ventaAgencia"
              element={
                <RequireAuth>
                  <NewSale />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/log/kardex"
              element={
                <RequireAuth>
                  <LogKardexReport />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/actual/kardex"
              element={
                <RequireAuth>
                  <CurrentKardexReport />
                </RequireAuth>
              }
            />
            <Route
              path="/factura"
              element={
                <RequireAuth>
                  <InvoiceComponent />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/ventas/general"
              element={
                <RequireAuth>
                  <SalesReport />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/ventas/productos"
              element={
                <RequireAuth>
                  <SalesByProductReport />
                </RequireAuth>
              }
            />
            <Route
              path="/pedidos/facturar"
              element={
                <RequireAuth>
                  <InvoiceOrders />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
