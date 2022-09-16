import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
// import Login from "../pages/login";
// import AppLayout from "../pages/layout";
// import Dashboard from "../pages/dashboard";
// import AdminUser from "../pages/adminUser";
// import User from "../pages/user";
// import Blog from "../pages/blog";
// import Order from "../pages/order";
const Login = lazy(() => import("../pages/login"));
const AppLayout = lazy(() => import("../pages/layout"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const AdminUser = lazy(() => import("../pages/adminUser"));
// const Users = lazy(() => import("../pages/user"));
const Blog = lazy(() => import("../pages/blog"));
// const Order = lazy(() => import("../pages/order"));
const COMPONENT_MAP = {
  login: Login,
  dashboard: Dashboard,
  adminUser: AdminUser,
  // users: Users,
  blog: Blog,
  // order: Order,
};
const handleComponent = (key) => {
  const Com = COMPONENT_MAP[key];
  return (
    //使用懒加载的图片需要用suspense组件包裹，fallback是组件没加载完显示的内容
    <Suspense fallback={<div>loading...</div>}>
      <Com />
    </Suspense>
  );
};
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          {/*动态路由渲染，根据权限配置显示对应的路由*/}
          {Object.keys(COMPONENT_MAP).map((item) => (
            <Route
              key={item}
              path={item}
              element={handleComponent(item)}
            ></Route>
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
