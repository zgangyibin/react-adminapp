import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import AppLayout from "../pages/layout";
import Dashboard from "../pages/dashboard";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
export default Router;
