import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  List,
  Checkbox,
} from "antd";
import {
  getAdminUserList,
  addCreateAdminUser,
  updateAdminUser,
  delAdminUser,
} from "../../api/adminUserService";
import { connect } from "react-redux";
import { PAGEAUTH } from "../../config";
import { Fragment, useEffect, useReducer, useState } from "react";
import { formatDate } from "../../utils/tool";
import React from "react";

const initData = {
  user: {},
  type: "",
  role: "1",
  authority: JSON.parse(JSON.stringify(PAGEAUTH[1])),
};

//使用useReducer
function reducer(state, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
}
const AdminUser = function () {
  //hooks
  const [form] = Form.useForm(); //返回一个form对象，把form对象传递form表单的form属性，可以获取该form的实例
  const [data, setState] = useState([]);
  const [state, dispatch] = useReducer(reducer, initData); //reducer初始化数据
  // 根据state的type属性判断是添加管理员还是修改
  const [visible, setVisible] = useState(false);
  const onFinish = (values) => {
    // console.log(values);
    if (state.type === "add") {
      //添加管理员
      addCreateAdminUser(
        {
          ...values,
          role: state.role,
          authority: JSON.stringify(state.authority),
        },
        () => {
          //添加成功后重新获取管理员列表接口
          message.success("添加成功");
          setVisible(false);
          init();
        }
      );
    } else {
      console.log(state);
      updateAdminUser(
        {
          ...values,
          id: state.user.id,
        },
        () => {
          message.success("修改成功");
          setVisible(false);
          init();
        }
      );
    }
  };
  useEffect(function () {
    init();
  }, []);
  const init = () => {
    getAdminUserList({ page: 1 }, (res) => {
      //   console.log(res);
      setState(res.data);
    });
  };
  //隐藏弹窗
  const handleonCancel = () => {
    setVisible(false);
  };
  //编辑
  const handleEdit = (row) => {
    // console.log(row);
    // 设置form表单的值
    console.log(form);
    form.setFieldsValue({
      username: row.username,
      password: row.password,
      nick: row.nick,
    });
    dispatch({
      user: row,
      type: "edit",
      password: row.password,
      nick: row.nick,
    });
    setVisible(true);
  };
  //添加管理员
  const handleAddUser = () => {
    // 设置form表单的值
    form.setFieldsValue({
      username: "",
      password: "",
    });
    dispatch({ user: {}, type: "add", role: "1", authority: PAGEAUTH[1] });
    setVisible(true);
  };
  // 删除管理员
  const handleDel = (row) => {
    delAdminUser(
      {
        id: row.id,
      },
      () => {
        message.success("删除成功");
        init();
      }
    );
  };
  //修改用户权限
  const onChangeAuth = (item, key, e) => {
    // item页面，key页面的操作名称，e当前CheckBox的对象
    console.log(item, key, e);
    state.authority[item][key] = e.target.checked;
    dispatch({ authority: state.authority });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "昵称",
      dataIndex: "nick",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (text) => formatDate(text, "YYYY-MM-DD hh:mm:ss"),
    },
    {
      title: "编辑",
      dataIndex: "id",
      render: (
        text,
        row //row是整行的数据
      ) => (
        <Fragment>
          <Space>
            <Button onClick={() => handleEdit(row)} type="primary">
              编辑
            </Button>

            <Popconfirm
              title="确认删除？"
              onConfirm={() => handleDel(row)}
              okText="确认"
              cancelText="取消"
            >
              <a href="#">
                <Button type="danger">删除</Button>
              </a>
            </Popconfirm>
          </Space>
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <p>
        <Button onClick={handleAddUser}>添加管理员</Button>
      </p>
      <Table rowKey="id" columns={columns} dataSource={data} />
      <Modal
        onCancel={handleonCancel}
        title={state.type === "add" ? "添加管理员" : "修改管理员信息"}
        visible={visible}
        footer={false}
        width={1200}
      >
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input disabled={state.type !== "add"} />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="密码"
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
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="昵称"
            name="nick"
            rules={[
              {
                required: true,
                message: "Please input your nick!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <p style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" ghost>
                {state.type === "add" ? "提交" : "修改"}
              </Button>
            </p>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AdminUser;
