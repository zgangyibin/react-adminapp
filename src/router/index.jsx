import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import AppLayout from "../pages/layout";
import Dashboard from "../pages/dashboard";
import AdminUser from "../pages/adminUser";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/adminuser" element={<AdminUser />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
