import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DatabaseOutlined,
  UsergroupAddOutlined,
  FileProtectOutlined,
  DownOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar, Image, Dropdown, Space } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./index.scss"; //导入的样式是全局的
// import styles from "./index.module.scss"; //模块化导入样式文件，css样式是局部样式，样式名后面自动加随机值

const { Header, Sider, Content } = Layout;

const AppLayout = ({ user, dispatch }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // 退出登录函数
  const handleLogout = () => {
    sessionStorage.clear();
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <span onClick={handleLogout}>退出登录</span>,
        },
      ]}
    />
  );

  useEffect(() => {
    // 由于是全局组件，所以在layout进行用户是否登录的权限验证
    // 路由跳转必须在组件渲染完成之后
    if (
      !sessionStorage.getItem("token") ||
      !sessionStorage.getItem("userInfo")
    ) {
      //用户没登录
      navigate("/login");
    }
  }, []); //模拟mounted生命周期，渲染完成调用一次该函数

  return (
    <Layout id="components-layout-demo-custom-trigger">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src={logo} />
          后端管理
        </div>
        {/*<span className={styles.h1}>444</span>*/}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DatabaseOutlined />,
              label: <Link to={"/dashboard"}>数据汇总</Link>,
            },
            {
              key: "2",
              icon: <UsergroupAddOutlined />,
              label: <Link to={"/adminuser"}>管理员</Link>,
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: <Link to={"/user"}>用户管理</Link>,
            },
            {
              key: "4",
              icon: <FileProtectOutlined />,
              label: <Link to={"/product"}>商品管理</Link>,
            },
            {
              key: "5",
              icon: <SketchOutlined />,
              label: <Link to={"/order"}>订单管理</Link>,
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div>
            <Avatar
              src={
                <Image
                  src="https://joeschmoe.io/api/v1/random"
                  style={{ width: 32 }}
                />
              }
            />
            <Dropdown overlay={menu}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {user.userInfo.username}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            display: "block",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(
  (state) => ({ user: state.user }),
  (dispatch) => ({ dispatch })
)(AppLayout);
