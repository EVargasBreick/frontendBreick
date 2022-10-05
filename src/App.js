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
function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login></Login>}></Route>
            <Route path="/display" element={<Display />} />
            <Route path="/editarProducto" element={<EditProducts />}></Route>
            <Route path="/nuevoProducto" element={<CreateProduct />}></Route>
            <Route path="/adminPedidos" element={<ManageOrders />} />
            <Route path="/modPedidos" element={<ModifyOrder />} />
            <Route path="/regCliente" element={<RegisterClient />} />
            <Route path="/buscarCliente" element={<FindClient />} />
            <Route path="/regPedido" element={<NewOrder />} />
            <Route path="/facturar" element={<NewInvoice />} />
            <Route path="/principal" element={<MainPage />} />
            <Route path="/nuevoUsuario" element={<CreateUser />} />
            <Route path="/editarCliente" element={<UpdateClients />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
