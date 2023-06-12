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
import CancelInvoice from "./Components/cancelInvoice";
import UpdateStock from "./Components/updateStock";
import NewPack from "./Components/newPack";
import AsignPack from "./Components/asignPack";
import EndOfDayReport from "./Components/endOfDayReport";
import OrderReception from "./Components/orderReception";
import RouteTransfer from "./Components/routeTransfer";
import OrdersToReady from "./Components/ordersToReady";
import RejectedOrders from "./Components/rejectedOrders";
import RouteSale from "./Components/routeSale";
import EditTransfer from "./Components/editTransfer";
import StoreRefill from "./Components/storeRefill";
import TransferReception from "./Components/transferReception";
import ProductDrop from "./Components/productDrop";
import RetirePack from "./Components/retirePack";
import AllOrders from "./Components/allOrders";
import RePrintInvoices from "./Components/rePrintInvoices";
import EntryReport from "./Components/entryReport";
import LoggedStockReport from "./Components/loggedStockReport";
import NewSaleAlt from "./Components/newSaleAlt";
import CancelInvoiceAlt from "./Components/cancelInvoiceAlt";
import RouteSaleAlt from "./Components/routeSaleAlt";
import InvoiceOrdersAlt from "./Components/invoiceOrdersAlt";
import RePrintInvoicesAlt from "./Components/rePrintInvoicesAlt";

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
              path="/pedidos"
              element={
                <RequireAuth>
                  <AllOrders />
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
            <Route
              path="/facturas/anular"
              element={
                <RequireAuth>
                  <CancelInvoice />
                </RequireAuth>
              }
            />
            <Route
              path="/facturasAnular"
              element={
                <RequireAuth>
                  <CancelInvoiceAlt />
                </RequireAuth>
              }
            />
            <Route
              path="/stock/actualizar"
              element={
                <RequireAuth>
                  <UpdateStock />
                </RequireAuth>
              }
            />
            <Route
              path="/packs/registrar"
              element={
                <RequireAuth>
                  <NewPack />
                </RequireAuth>
              }
            />
            <Route
              path="/packs/asignar"
              element={
                <RequireAuth>
                  <AsignPack />
                </RequireAuth>
              }
            />
            <Route
              path="/packs/retirar"
              element={
                <RequireAuth>
                  <RetirePack />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/ventas/cierre"
              element={
                <RequireAuth>
                  <EndOfDayReport />
                </RequireAuth>
              }
            />
            <Route
              path="/almacenes/recepcionar-pedidos"
              element={
                <RequireAuth>
                  <OrderReception />
                </RequireAuth>
              }
            />
            <Route
              path="/traspasoMovil"
              element={
                <RequireAuth>
                  <RouteTransfer />
                </RequireAuth>
              }
            />
            <Route
              path="/alistarPedidos"
              element={
                <RequireAuth>
                  <OrdersToReady />
                </RequireAuth>
              }
            />
            <Route
              path="/rechazados"
              element={
                <RequireAuth>
                  <RejectedOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/ventas/ruta"
              element={
                <RequireAuth>
                  <RouteSale />
                </RequireAuth>
              }
            />
            <Route
              path="/traspasos/editar"
              element={
                <RequireAuth>
                  <EditTransfer />
                </RequireAuth>
              }
            />
            <Route
              path="/traspaso/recargar"
              element={
                <RequireAuth>
                  <StoreRefill />
                </RequireAuth>
              }
            />
            <Route
              path="/traspaso/recepcion"
              element={
                <RequireAuth>
                  <TransferReception />
                </RequireAuth>
              }
            />
            <Route
              path="/productos/baja"
              element={
                <RequireAuth>
                  <ProductDrop />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/entradas"
              element={
                <RequireAuth>
                  <EntryReport />
                </RequireAuth>
              }
            />
            <Route
              path="/facturas/reimprimir"
              element={
                <RequireAuth>
                  <RePrintInvoices />
                </RequireAuth>
              }
            />
            <Route
              path="/facturasReimprimir"
              element={
                <RequireAuth>
                  <RePrintInvoicesAlt />
                </RequireAuth>
              }
            />
            <Route
              path="/reportes/stock"
              element={
                <RequireAuth>
                  <LoggedStockReport />
                </RequireAuth>
              }
            />
            <Route
              path="/ventas/agencia"
              element={
                <RequireAuth>
                  <NewSaleAlt />
                </RequireAuth>
              }
            />
            <Route
              path="/ventas/rutas"
              element={
                <RequireAuth>
                  <RouteSaleAlt />
                </RequireAuth>
              }
            />
            <Route
              path="/pedidos/facturacion"
              element={
                <RequireAuth>
                  <InvoiceOrdersAlt />
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
