import { BrowserRouter, Route, Routes } from "react-router-dom";
//lazy可以实现分片打包（分模块），不用把所有js打包在同一文件，用到模块在加载对应的js文件，用户体验更好
import { lazy } from "react";
import { connect } from "react-redux";
// import Login from "../pages/login";
const Login = lazy(() => import("../pages/login"));
const AppLayout = lazy(() => import("../pages/layout"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const AdminUser = lazy(() => import("../pages/adminUser"));
const User = lazy(() => import("../pages/user"));
const Product = lazy(() => import("../pages/product"));
const Order = lazy(() => import("../pages/order"));
// import AppLayout from "../pages/layout";
// import Dashboard from "../pages/dashboard";
// import AdminUser from "../pages/adminUser";
// import User from "../pages/user";
// import Product from "../pages/product";
// import Order from "../pages/order";

const COMPONENT_MAP = {
  dashboard: Dashboard,
  adminuser: AdminUser,
  users: User,
  product: Product,
  order: Order,
};
const handleComponent = (key) => {
  //高阶函数，返回一个组件
  const Com = COMPONENT_MAP[key];
  console.log(Com);
  return <Com />;
};

function Router({ pageConfig }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          {/*动态路由渲染，根据权限配置显示对应的路由*/}
          {Object.keys(pageConfig).map(
            (item) =>
              pageConfig[item].view && (
                <Route
                  key={item}
                  path={item}
                  element={handleComponent(item)}
                ></Route>
              )
          )}
          {/*
         <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="adminuser" element={<AdminUser />}></Route>
          <Route path="users" element={<User />}></Route>
          <Route path="product" element={<Product />}></Route>
          <Route path="order" element={<Order />}></Route>*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default connect((state) => ({
  pageConfig: state?.user?.userInfo.authority
    ? JSON.parse(state?.user?.userInfo.authority)
    : {},
}))(Router);
