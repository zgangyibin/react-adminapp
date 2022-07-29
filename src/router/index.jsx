import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import AppLayout from "../pages/layout";
import Dashboard from "../pages/dashboard";
import AdminUser from "../pages/adminUser";
import User from "../pages/user";
import Product from "../pages/product";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="adminuser" element={<AdminUser />}></Route>
          <Route path="user" element={<User />}></Route>
          <Route path="product" element={<Product />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
