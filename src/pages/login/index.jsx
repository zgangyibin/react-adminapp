import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/userService";
import styles from "./index.module.scss";
import logo from "../../assets/login.png";
import { connect } from "react-redux";

function Login({ dispatch }) {
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
        const userInfo = res.data[0].datas[0];
        dispatch({
          type: "SET_USER",
          payload: userInfo,
        });
        //跳转之前需要判断用户是否有dashboard访问权限，如果没有需要找一个能访问的页面跳转
        let auth = JSON.parse(userInfo.authority);
        let skipPage = "/dashboard";
        if (!auth.dashboard.view) {
          let keyArr = Object.keys(auth);
          for (let i = 0; i < keyArr.length; i++) {
            if (auth[keyArr[i]].view) {
              skipPage = `/${keyArr[i]}`;
              break;
            }
          }
        }
        navigate(skipPage);
      }
    });
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

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            ></Form.Item>

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
