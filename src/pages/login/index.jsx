import { Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/userService";
import styles from "./index.module.scss";
import logo from "../../assets/login.png";
import { staticUrl } from "../../api/api";
import { connect } from "react-redux";
import { useState } from "react";

function Login({ dispatch }) {
  const [src, setSrc] = useState(`${staticUrl}/yzm`);
  const navigate = useNavigate(); //实例化路由对象
  const onFinish = (values) => {
    //点击form表单提交按钮触发的函数
    console.log("Success:", values);
    login(values, (res) => {
      console.log(res);
      if (!res.token) {
        message.error("用户名或密码错误");
      } else {
        sessionStorage.setItem("token", res.token);
        const userInfo = res.data;
        dispatch({
          type: "SET_USER",
          payload: userInfo,
        });
        //跳转之前需要判断用户是否有dashboard访问权限，如果没有需要找一个能访问的页面跳转
        // let auth = JSON.parse(userInfo.authority);
        let skipPage = "/dashboard";
        // if (!auth.dashboard.view) {
        //   let keyArr = Object.keys(auth);
        //   for (let i = 0; i < keyArr.length; i++) {
        //     if (auth[keyArr[i]].view) {
        //       skipPage = `/${keyArr[i]}`;
        //       break;
        //     }
        //   }
        // }
        navigate(skipPage);
      }
    });
  };
  const changeYzm = (e) => {
    //切换验证码
    setSrc(`${staticUrl}/yzm?id=${new Date().getTime()}`);
  };
  return (
    <div className={styles.login}>
      <dl>
        <dt>
          <h1>登录</h1>
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="yzm"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <img
                    onClick={changeYzm}
                    style={{ height: "35px" }}
                    src={src}
                    alt=" "
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" ghost>
                登录
              </Button>
            </Form.Item>
          </Form>
          <p>忘记密码</p>
        </dt>
        <dd>
          <div>
            <img src={logo} />
          </div>
          <h1>后端管理</h1>
        </dd>
      </dl>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};
export default connect(() => ({}), mapDispatchToProps)(Login);
