import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import AppLayout from "../pages/layout";
import Dashboard from "../pages/dashboard";
import AdminUser from "../pages/adminUser";
import User from "../pages/user";
import Blog from "../pages/blog";
import Order from "../pages/order";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="adminuser" element={<AdminUser />}></Route>
          <Route path="users" element={<User />}></Route>
          <Route path="blog" element={<Blog />}></Route>
          <Route path="order" element={<Order />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
